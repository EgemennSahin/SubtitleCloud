from functions import main_function
from google.cloud import storage
import functions_framework
from flask import json
import requests
import os
import pickle
import bz2
import datetime as dt

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
        
    # get ip address for logging purposes 
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        ip_address = request.environ['REMOTE_ADDR']
    elif request.environ.get('HTTP_X_FORWARDED_FOR'):
        ip_address = request.environ['HTTP_X_FORWARDED_FOR']
    else :
        ip_address = "No_IP"
        
    
    print(f"IP address: {ip_address}") # if behind a proxy

    secret_recaptcha_key = os.getenv('CLOUDFLARE_SECRET')

    # Get the video url from the request
    request_data = request.get_json()
    print("Request: ", request_data)
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

    video_bucket_folder = "uploads/"
    video_id = request_data.get('video_id')
    bucket_name = "short-zoo-temp-videos"
    bucket = client.bucket(bucket_name)

    # Checking if file exists on storgae
    print("Checking video in bucket")
    blob = bucket.blob(video_bucket_folder + video_id)
    if not blob.exists():
        print("Video: ", video_id, " doesn't exist in the bucket")
        return ('Video does not exist', 403)

    # Download the file
    print("Downloading the video")
    file_tmp_path = "/tmp/raw_" + video_id
    blob.download_to_filename(file_tmp_path)

    # Delete the raw video
    blob.delete()

    # This is where the output will be saved
    output_name = "/tmp/edited_" + video_id
    
    # Download the models if everything has been verified
    # Only download models if they haven't been downloaded
    non_downloaded_models = [key for key, value in models.items() if value is None]

    if (len(non_downloaded_models) > 0):
        print("Downloading models")
        for model in non_downloaded_models:
            pickled_model = model + ".pkl.bz2"
            models_bucket.blob("models/" + pickled_model).download_to_filename(
                "/tmp/" + pickled_model)
            with bz2.BZ2File("/tmp/" + pickled_model, 'rb') as pickle_file:
                models[model] = pickle.load(pickle_file)

    # Run the main function
    print("Starting the editing process")
    output_file = main_function(
        main_video=file_tmp_path,
        models=models,
        output_name=output_name)

    output_file_name = "created/" + ip_address + "/" + video_id

    # Upload the created video
    new_blob = bucket.blob(output_file_name)
    new_blob.upload_from_filename(output_file, content_type='video/mp4')


    # Generate a signed URL
    url = new_blob.generate_signed_url(
        expiration=2592000,  # The URL will be valid for 1 month (in seconds)
        method='GET'      # This URL will allow GET requests
    )

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': 'https://www.shortzoo.com',
        'Content-Type': 'application/json'
    }

    # Return the edited video's url
    response_body = {'url': url}
    response = json.dumps(response_body)

    return (response, 200, headers)
