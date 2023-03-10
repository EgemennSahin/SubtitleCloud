from video_processing import process_video
from google.cloud import storage
import functions_framework
from flask import json
from datetime import timedelta

# Download the models from the bucket
client = storage.Client.from_service_account_json('public-process-account-key.json')
bucket = client.bucket("shortzoo-premium")

@functions_framework.http
def edit_video(request):
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

    # Get the video url from the request
    request_data = request.get_json()
    uid = request_data.get('uid')
    video_data = request_data.get('video_data')
    vid = video_data.get('video_id')
    data = {
        "video_id": None,
        "subtitle_id": None,
        "secondary_id": None
    }
    title = ""

    for key in data:
        # Get the data from the request
        id = video_data.get(key)
        if ((key == "secondary_id") & (id == "")):
            data[key] = ""
            continue

        # Get the bucket paths for the files 
        path = ""
        if (key == "video_id"):
            path = "main/" + uid + "/" + vid
            temp_path = "/tmp/" + uid + "_" + vid
        elif (key == "subtitle_id"):
            path = "subtitle/" + uid + "/" + vid
            temp_path = "/tmp/" + uid + "_sub_" + vid
        elif (key == "secondary_id"):
            path = "secondary/" + uid + "/" + id
            temp_path = "/tmp/" + uid + "_secondary_" + id
        else:
            print("Invalid key")
            return ('Invalid key', 403)
            
        # Check if the file exists
        blob = bucket.blob(path)
        if not blob.exists():
            print(key, id, " doesn't exist in the bucket")
            return ('File does not exist', 403)

        if (key == "video_id"):
            metadata_blob = bucket.get_blob(path)
            title = metadata_blob.metadata["title"]
            print("title: ", title)
            print('Metadata: ', blob.metadata)
                
        # Download the file into a temporary location
        blob.download_to_filename(temp_path)
        
        # Save the data
        data[key] = temp_path


    # Run the main function
    print("Starting the editing process")

    output_name = "/tmp/" + uid + "_" + vid
    output_file = process_video(
        data["video_id"],
        data["secondary_id"],
        data["subtitle_id"],
        output_name)

    output_file_name = "output/" + uid + "/" + vid + ".mp4"

    # Upload the created video
    new_blob = bucket.blob(output_file_name)
    new_blob.upload_from_filename(output_file, content_type='video/mp4')

    metadata = { "title": title }
    new_blob.metadata = metadata
    new_blob.patch()

    # Generate a signed URL
    url = new_blob.generate_signed_url(
        version="v4",
        expiration=timedelta(days=7),
        method='GET'
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
