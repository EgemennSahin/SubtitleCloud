from audioProcessing import process_audio
from google.cloud import storage
import functions_framework
from flask import json
import requests
import os
import pickle
import bz2
from datetime import timedelta

# Download the models from the bucket
client = storage.Client.from_service_account_json('public-process-account-key.json')
models_bucket = client.bucket("subtitle-cloud-models")

models = {
    "whisper": None,
    "align_model": None,
    "align_model_metadata": None}


@functions_framework.http
def public_process_video(request):
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
        
    secret_recaptcha_key = os.getenv('CLOUDFLARE_SECRET')

    # Get the video url from the request
    request_data = request.get_json()
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
    uid = request_data.get('uid')
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

    if (len(non_downloaded_models) > 0):
        for model in non_downloaded_models:
            print("Downloading: ", model)
            pickled_model = model + ".pkl.bz2"
            blob =  models_bucket.blob("models/" + pickled_model)
            blob.chunk_size =1<<20
            blob.download_to_filename(
                "/tmp/" + pickled_model)
            with bz2.BZ2File("/tmp/" + pickled_model, 'rb') as pickle_file:
                models[model] = pickle.load(pickle_file)

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

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': 'https://www.shortzoo.com',
        'Content-Type': 'application/json'
    }
    

    # Return the edited video's url
    response_body = {'download_url': download_url, 'upload_url': upload_url}
    response = json.dumps(response_body)

    return (response, 200, headers)
