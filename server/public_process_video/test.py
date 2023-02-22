from google.cloud import storage
from datetime import timedelta

client = storage.Client.from_service_account_json(
    'public-process-account-key.json')
bucket_name = "short-zoo-temp-videos"
bucket = client.bucket(bucket_name)


# Upload the created video
new_blob = bucket.blob("testing_now")
new_blob.upload_from_filename("test.mp4", content_type='video/mp4')

# Generate a signed URL
url = new_blob.generate_signed_url(
    version="v4",
    # This URL is valid for 15 minutes
    expiration=timedelta(seconds=1),
    method='GET'
)

print(url)
