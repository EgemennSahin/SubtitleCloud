# Needed for extracting audio from video
import ffmpeg

# Needed for transcribing subtitles
from stable_whisper import load_model, save_as_json, open_results, to_srt

import whisperx
import whisperx.utils

resultsPath = "../assets/results_aligned.json"


# Create an audio file from the mp4 file and export an accordingly named file
def createAudio(mp4_filename, output_filename):
    (
        ffmpeg.input(mp4_filename)
        .output(output_filename)
        .run()
    )

    return output_filename


# Transcribe the mp3 file and export a Whisper response
def getResult(audio_filename):
    # Import the model
    model = load_model("medium")

    DECODE_OPTIONS = {'language': 'en'}

    result = model.transcribe(audio_filename, **DECODE_OPTIONS, fp16=False)

    model_a, metadata = whisperx.load_align_model(
        language_code="en", device="cpu")

    results_aligned = whisperx.align(
        result["segments"], model_a, metadata, audio_filename, "cpu")

    save_as_json(results_aligned, resultsPath)

    return results_aligned


# Create subtitles from Whisper response and export an accordingly named srt file
def translate(whisper_response, output_srt_filename):

    # UPPERCASE EVERYTHING
    for i in whisper_response["word_segments"]:
        i["text"] = i["text"].upper()

    to_srt(whisper_response["word_segments"], output_srt_filename, strip=True)
    return output_srt_filename


# Main Function
def audioProcessing(main_video, output_name):
    print("Extracting audio from main video.")
    mp3_filename = createAudio(main_video, output_name + '.mp3')

    print("Transcribing audio using AI.")
    # results = getResult(mp3_filename)
    results = open_results(resultsPath)

    print("Creating subtitles from the transcription.")
    subtitle_filename = translate(results, output_name + '.srt')

    return (mp3_filename, subtitle_filename)
