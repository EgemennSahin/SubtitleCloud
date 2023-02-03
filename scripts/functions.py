from audioProcessing import process_audio
from videoProcessing import process_video_simple
import os


def main_function(main_video, output_path, whisper, align_model, metadata):
    # Get the output name without the extension
    output_name, ext = os.path.splitext(output_path)

    print(output_name)
    # Create mp3 and subtitles
    mp3_filename, subtitle_filename = process_audio(
        main_video, output_name, whisper, align_model, metadata)

    # Edit video
    edited_video = process_video_simple(
        main_video, mp3_filename, subtitle_filename, output_name)

    return edited_video
