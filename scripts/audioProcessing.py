# Needed for extracting audio from video
import ffmpeg

# Needed for transcribing subtitles
import whisperx
import whisperx.utils

# Create an audio file from the mp4 file and export an accordingly named file


def downloadVideo(url, output_filename):

    try:
        (
            ffmpeg.input(url)
            .output(output_filename)
            .run()
        )
    except ffmpeg.Error as e:
        print(e.stderr)

    return output_filename


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
    model = whisperx.load_model("tiny")

    DECODE_OPTIONS = {'language': 'en'}

    result = model.transcribe(audio_filename, **DECODE_OPTIONS, fp16=False)

    model_a, metadata = whisperx.load_align_model(
        language_code="en", device="cpu")

    results_aligned = whisperx.align(
        result["segments"], model_a, metadata, audio_filename, "cpu")

    return results_aligned


# Create subtitles from Whisper response and export an accordingly named srt file
def translate(whisper_response, output_srt_filename):

    # UPPERCASE EVERYTHING
    for i in whisper_response["word_segments"]:
        i["text"] = i["text"].upper()

    with open(output_srt_filename, "w", encoding="utf-8") as srt:
        whisperx.utils.write_srt(whisper_response["word_segments"], file=srt)

    return output_srt_filename


# Main Function
def audioProcessing(main_video, output_name):
    print("Downloading main video.")
    download_video = downloadVideo(main_video, output_name + '_download.mp4')

    print("Extracting audio from main video.")
    mp3_filename = createAudio(download_video, output_name + '.mp3')

    print("Transcribing audio using AI.")
    results = getResult(mp3_filename)

    print("Creating subtitles from the transcription.")
    subtitle_filename = translate(results, output_name + '.srt')

    return (mp3_filename, subtitle_filename)
