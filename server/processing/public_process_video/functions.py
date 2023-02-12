from audioProcessing import process_audio
from videoProcessing import process_video_simple


def main_function(main_video, output_name):
    # Create mp3 and subtitles
    mp3_filename, subtitle_filename = process_audio(
        main_video, output_name)

    # Edit video
    edited_video = process_video_simple(
        main_video, mp3_filename, subtitle_filename, output_name)

    return edited_video
