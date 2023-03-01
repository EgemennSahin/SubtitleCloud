# Needed for extracting audio from video
import ffmpeg

# Needed for transcribing subtitles
import whisperx
import whisperx.utils


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
    # Load the models
    model = whisperx.load_model("base.en")
    model_a, metadata = whisperx.load_align_model(
        language_code="en", device="cpu")

    result = transcribe_whisper(audio_filename, model)

    results_aligned = align_whisperx(audio_filename, result, model_a, metadata)

    return results_aligned


def transcribe_whisper(audio_filename, model):

    DECODE_OPTIONS = {'language': 'en'}

    result = model.transcribe(audio_filename, **DECODE_OPTIONS, fp16=False)

    return result


def align_whisperx(audio_filename, result, model_a, metadata):

    results_aligned = whisperx.align(
        result["segments"], model_a, metadata, audio_filename, "cpu")

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
