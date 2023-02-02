from google.cloud import storage, logging
from sc_main import mainFunction


def get_object_url(event, context):
    file_bucket = event['bucket']
    file_path = event['name']

    logging.log_text("Event: " + file_path)
    client = storage.Client()
    bucket = client.bucket(file_bucket)
    temp_file_path = "/tmp/" + file_path
    blob = bucket.blob(file_path)
    blob.download_to_filename(temp_file_path)
    logging.log_text("Blob: " + blob)

    output_file = mainFunction(temp_file_path)

    output_file_name = "edited-videos/" + output_file

    new_blob = bucket.blob(output_file_name)
    new_blob.upload_from_filename(output_file, content_type='video/mp4')
    logging.info("Uploaded " + output_file_name + " to " + file_bucket)
