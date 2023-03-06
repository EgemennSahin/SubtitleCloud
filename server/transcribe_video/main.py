import pickle
from audioProcessing import process_audio
from google.cloud import storage, firestore
import functions_framework
from flask import json
import requests
import os
from datetime import timedelta

client = storage.Client.from_service_account_json('public-process-account-key.json')

models = {
    "whisper": None,
    "align_model": None,
    "align_model_metadata": None}

for model in models:
    print("Unpickling: ", model)
    pickled_model = model + ".pkl"
    with open(pickled_model, 'rb') as pickle_file:
        models[model] = pickle.load(pickle_file)

@functions_framework.http
def transcribe_video(request):
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': 'https://www.shortzoo.com',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)
         
    request_data = request.get_json()
    uid = request_data.get('uid')
    db = firestore.Client()
    user_ref = db.collection('users').document(uid)
    doc_snapshot = user_ref.get()

    if (not doc_snapshot.exists):
        print("User: ", uid, " doesn't exist")
        return ('User does not exist', 403)

    video_credit = doc_snapshot.get('video_credit')
    if (video_credit <= 0):
        print("User: ", uid, " doesn't have enough credits")
        return ('No credits available', 403)
            
    secret_recaptcha_key = os.getenv('CLOUDFLARE_SECRET')

    # Get the video url from the request
    token = request_data.get('token')

    print("Verification started.")
    # Verify the token
    captcha_response = requests.post(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            "secret": secret_recaptcha_key,
            "response": token
        }
    )

    captcha_data = captcha_response.json()

    if not captcha_data['success']:
        print("Captcha failed")
        return ('Invalid reCAPTCHA Token', 403)
    
    print("Verification finished.")

    video_id = request_data.get('video_id')
    bucket = client.bucket("shortzoo-premium")
    video_path = "main/" + uid + "/" + video_id

    # Checking if file exists on storgae
    print("Checking video in bucket")
    blob = bucket.blob(video_path)
    if not blob.exists():
        print("Video: ", video_id, " doesn't exist in the bucket")
        return ('Video does not exist', 403)

    # Download the models if everything has been verified
    # Only download models if they haven't been downloaded
    non_downloaded_models = [key for key, value in models.items() if value is None]

    # Download the file
    print("Downloading the video")
    file_tmp_path = "/tmp/raw_" + uid + "_" + video_id
    blob.download_to_filename(file_tmp_path)

    # This is where the output will be saved
    output_name = "/tmp/sub_" + uid + "_" + video_id

    # Run the main function
    print("Starting the editing process")
    output_file = process_audio(
        file_tmp_path,
        models,
        output_name)
    
    subtitle_path = "subtitle/" + uid + "/" + video_id

    # Upload the created video
    new_blob = bucket.blob(subtitle_path)
    new_blob.upload_from_filename(output_file, content_type='text/plain')

    # Generate a signed URL to download
    download_url = new_blob.generate_signed_url(
        version="v4",
        expiration=timedelta(days=1),
        method='GET'
    )

    # Generate a signed URL to upload
    upload_url = new_blob.generate_signed_url(
        version="v4",
        expiration=timedelta(days=1),
        method='PUT'
    )

    # Delete all the temporary files
    os.remove(file_tmp_path)
    os.remove(output_file)

    # Decrease the number of credits
    print("Decreasing credits")
    user_ref.update({
        'video_credit': firestore.Increment(-1)
    })

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': 'https://www.shortzoo.com',
        'Content-Type': 'application/json'
    }
    
    # Return the edited video's url
    response_body = {'download_url': download_url, 'upload_url': upload_url}
    response = json.dumps(response_body)

    return (response, 200, headers)
