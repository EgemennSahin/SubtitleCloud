import whisperx
import pickle
import bz2

# Load the models
model = whisperx.load_model("base.en")
model_a, metadata = whisperx.load_align_model(
    language_code="en", device="cpu")

# Get the models in the bucket under the models folder
models = {"whisper": model,
          "align_model": model_a,
          "align_model_metadata": metadata}

for model in models:
    pickled_model = model + ".pkl.bz2"

    # Create pickled compressed file
    with bz2.BZ2File(pickled_model, 'wb') as pickle_file:
        pickle.dump(models[model], pickle_file)
