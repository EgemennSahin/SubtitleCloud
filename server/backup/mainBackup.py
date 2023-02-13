from functions import main_function
from google.cloud import storage

def get_object_url(event, context):
    file_bucket = event['bucket']
    client = storage.Client()
    in_bucket = client.bucket(file_bucket)
    file_path = event['name']

    # This is the user id
    user_id = "".join(file_path.split("/")[1])

    # This is the video id
    video_id = "".join(file_path.split("/")[2])

    # This is where the file will be downloaded to
    file_tmp_path = "/tmp/" + user_id + "_" + video_id

    # Download the file
    blob = in_bucket.blob(file_path)
    blob.download_to_filename(file_tmp_path)

    # This is where the output will be saved
    output_name = "/tmp/" + user_id + "_" + video_id + "_output"

    # Run the main function
    output_file = main_function(
        main_video=file_tmp_path,
        output_name=output_name)

    output_file_name = "videos/" + user_id + "/" + video_id

    # Get the output bucket
    out_bucket = client.bucket("subtitle-cloud-generated-output")
    new_blob = out_bucket.blob(output_file_name)
    new_blob.upload_from_filename(output_file, content_type='video/mp4')
