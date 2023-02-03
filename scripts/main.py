from google.cloud import storage
from functions import main_function
import pickle
import bz2


def get_object_url(event, context):
    file_bucket = event['bucket']
    client = storage.Client()
    in_bucket = client.bucket(file_bucket)

    file_path = event['name']

    # This is the user id
    user_id = file_path.split("/")[0]

    # This is where the file will be downloaded to
    file_name = str(file_path.split("/")[1:])
    file_tmp_path = "/tmp/" + user_id + "/" + file_name

    # Download the file
    blob = in_bucket.blob(file_path)
    blob.download_to_filename(file_tmp_path)

    # Get the models in the bucket under the models bucket
    models = {"whisper": None,
              "align_model": None,
              "align_model_metadata": None}

    models_bucket = client.bucket("subtitle-cloud-models")

    for model in models:
        pickled_model = model + ".pkl.bz2"
        models_bucket.blob("models/" + pickled_model).download_to_filename(
            "/tmp/" + pickled_model)
        with bz2.BZ2File("/tmp/" + pickled_model, 'rb') as pickle_file:
            models[model] = pickle.load(pickle_file)

    # This is where the output will be saved
    output_path = "/tmp/" + user_id + "/output_" + file_name

    # Run the main function
    output_file = main_function(
        main_video=file_tmp_path,
        output_path=output_path,
        whisper=models["whisper"],
        align_model=models["align_model"],
        metadata=models["align_model_metadata"])

    output_file_name = "output/test.mp4"

    # Get the output bucket
    out_bucket = client.bucket("subtitle-cloud-generated-output")
    new_blob = out_bucket.blob(output_file_name)
    new_blob.upload_from_filename(output_file, content_type='video/mp4')
