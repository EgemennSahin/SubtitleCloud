# Needed for extracting audio from video
import ffmpeg

# Needed for transcribing subtitles
import whisperx
import whisperx.utils

from google.cloud import storage
import pickle
import bz2

import os

# Create an audio file from the mp4 file and export an accordingly named file


def create_mp3(mp4_filename, output_filename):
    (
        ffmpeg.input(mp4_filename)
        .output(output_filename, preset="ultrafast")
        .run()
    )

    return output_filename


# Transcribe the mp3 file and export a Whisper response
def transcribe_mp3(audio_filename):
    # Get the models in the bucket under the models bucket
    client = storage.Client()
    models_bucket = client.bucket("subtitle-cloud-models")

    result = transcribe_whisper(audio_filename, models_bucket)

    results_aligned = align_whisperx(audio_filename, result, models_bucket)

    return results_aligned


def transcribe_whisper(audio_filename, models_bucket):
    model = "whisper"
    pickled_model = model + ".pkl.bz2"
    models_bucket.blob("models/" + pickled_model).download_to_filename(
        "/tmp/" + pickled_model)
    with bz2.BZ2File("/tmp/" + pickled_model, 'rb') as pickle_file:
        whisper = pickle.load(pickle_file)

    DECODE_OPTIONS = {'language': 'en'}

    result = whisper.transcribe(audio_filename, **DECODE_OPTIONS, fp16=False)

    os.remove("/tmp/" + pickled_model)
    return result


def align_whisperx(audio_filename, result, models_bucket):
    models = {"align_model": None,
              "align_model_metadata": None}

    for model in models:
        pickled_model = model + ".pkl.bz2"
        models_bucket.blob("models/" + pickled_model).download_to_filename(
            "/tmp/" + pickled_model)
        with bz2.BZ2File("/tmp/" + pickled_model, 'rb') as pickle_file:
            models[model] = pickle.load(pickle_file)

    results_aligned = whisperx.align(
        result["segments"], models["align_model"], models["align_model_metadata"], audio_filename, "cpu")

    for model in models:
        pickled_model = model + ".pkl.bz2"
        os.remove("/tmp/" + pickled_model)

    return results_aligned


def adjust_subtitles(subtitles, start_pad=0.05, end_pad=0.1):
    for i in range(len(subtitles)):
        current_subtitle = subtitles[i]
        current_start = current_subtitle['start']
        current_end = current_subtitle['end']

        current_start -= start_pad
        current_end += end_pad

        if i == 0 and current_start < 0:
            current_start = 0

        if i < len(subtitles) - 1:
            next_subtitle = subtitles[i + 1]
            next_start = next_subtitle['start']

            if current_end >= next_start - start_pad:
                current_end = next_start - start_pad

        current_subtitle['start'] = current_start
        current_subtitle['end'] = current_end

    return subtitles

# Create subtitles from Whisper response and export an accordingly named srt file


def export_srt(whisper_response, output_srt_filename):
    for i in whisper_response["word_segments"]:
        i["text"] = i["text"].upper()

    adjusted_subtitles = adjust_subtitles(whisper_response["word_segments"])

    with open(output_srt_filename, "w", encoding="utf-8") as srt:
        whisperx.utils.write_srt(adjusted_subtitles, file=srt)

    return output_srt_filename


# Main Function
def process_audio(main_video, output_name):
    print("Extracting audio from main video.")
    mp3_filename = create_mp3(main_video, output_name + '.mp3')

    print("Transcribing audio using AI.")
    results = transcribe_mp3(mp3_filename)

    print("Creating subtitles from the transcription.")
    subtitle_filename = export_srt(results, output_name + '.srt')

    return (mp3_filename, subtitle_filename)
