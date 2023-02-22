# Needed for video editing
import ffmpeg

# Needed to delete files
import os


def add_audio_subtitles(mp4_filename, mp3_filename, srt_filename, output_mp4_filename):
    style = "FontName=Mercadillo Black,FontSize=20,Alignment=10,PrimaryColour=&H03fcff,Outline=1"
    input_video = ffmpeg.input(mp4_filename)
    input_audio = ffmpeg.input(mp3_filename)

    try:
        (
            ffmpeg.concat(input_video, input_audio, v=1, a=1)
            .filter("subtitles", srt_filename, fontsdir="fonts", force_style=style)
            .output(output_mp4_filename, preset="ultrafast")
            .run()
        )
    except ffmpeg.Error as e:
        print('stdout:', e.stdout.decode('utf8'))
        print('stderr:', e.stderr.decode('utf8'))
        raise e

    return output_mp4_filename


def process_video_simple(main_video, mp3_filename, subtitle_filename, output_name):
    print("Adding subtitles to the video.")
    final_video = add_audio_subtitles(
        main_video, mp3_filename, subtitle_filename, output_name + '.mp4')

    os.remove(subtitle_filename)
    os.remove(mp3_filename)

    return final_video
