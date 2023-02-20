from functions import main_function
from google.cloud import storage
import functions_framework
from flask import json
import requests
import os
import pickle
import bz2

# Download the models from the bucket
client = storage.Client()
models_bucket = client.bucket("subtitle-cloud-models")

models = {
    "whisper": None,
    "align_model": None,
    "align_model_metadata": None}

for model in models:
    pickled_model = model + ".pkl.bz2"
    models_bucket.blob("models/" + pickled_model).download_to_filename(
        "/tmp/" + pickled_model)
    with bz2.BZ2File("/tmp/" + pickled_model, 'rb') as pickle_file:
        models[model] = pickle.load(pickle_file)


@functions_framework.http
def public_process_video(request):
    # Set CORS headers for the preflight request
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

    print("request: ", request)
    secret_recaptcha_key = os.getenv('CLOUDFLARE_SECRET')

    # Get the video url from the request
    request_data = request.get_json()
    print("request_data: ", request_data)
    token = request_data.get('token')

    print("Starting verification with the following data:")
    # Verify the token
    captcha_response = requests.post(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            "secret": secret_recaptcha_key,
            "response": token
        }
    )
    print("VERIFICATION FINISHED")

    captcha_data = captcha_response.json()

    if not captcha_data['success']:
        print("Captcha failed")
        return ('Invalid reCAPTCHA Token', 403)

    video_id = request_data.get('video_id')

    client = storage.Client()
    bucket_name = "short-zoo-temp-videos"
    bucket = client.bucket(bucket_name)

    # This is where the file will be downloaded to
    file_tmp_path = "/tmp/raw_" + video_id

    # Download the file
    print("Downloading the video")
    blob = bucket.blob(video_id)
    blob.download_to_filename(file_tmp_path)

    # Delete the raw video
    blob.delete()

    # This is where the output will be saved
    output_name = "/tmp/edited_" + video_id

    # Run the main function
    print("Starting the editing process")
    output_file = main_function(
        main_video=file_tmp_path,
        models=models,
        output_name=output_name)

    output_file_name = "created/" + video_id

    # Upload the created video
    new_blob = bucket.blob(output_file_name)
    new_blob.upload_from_filename(output_file, content_type='video/mp4')

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': 'https://www.shortzoo.com',
        'Content-Type': 'application/json'
    }
    url_prefix = "https://storage.googleapis.com/"
    processedVideoUrl = url_prefix + bucket_name + "/" + output_file_name

    # Return the edited video's url
    response_body = {'url': processedVideoUrl}
    response = json.dumps(response_body)

    return (response, 200, headers)
