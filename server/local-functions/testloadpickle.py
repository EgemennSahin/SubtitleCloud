import whisperx
import pickle
import time
import bz2

models = {"whisper": None,
          "align_model": None,
          "align_model_metadata": None}

print(time.time())
for model in models:
    pickled_model = model + ".pkl.bz2"

    # Create pickled compressed file
    with bz2.BZ2File(pickled_model, 'rb') as pickle_file:
        models[model] = pickle.load(pickle_file)

print(time.time())
