# Needed for video editing
import ffmpeg

# Needed to delete files
import os

# Find the smallest resolution in the combined 4 dimensions of the videos and return it


def findSmallestRes(main_mp4_filename, game_mp4_filename):
    probe_main = ffmpeg.probe(main_mp4_filename)['streams'][0]
    probe_game = ffmpeg.probe(game_mp4_filename)['streams'][0]

    # Find the smallest resolution
    return min(probe_main['width'], probe_main['height'], probe_game['width'], probe_game['height'])


# Trim and crop in the same workflow to reduce runtime
def trimCropVids(main_mp4_filename, game_mp4_filename, output_mp4_filename):
    # Find m
    m = findSmallestRes(main_mp4_filename, game_mp4_filename)

    # Get the main video's length
    duration = ffmpeg.probe(main_mp4_filename)["format"]["duration"]

    input_main_vid = ffmpeg.input(main_mp4_filename)
    input_game_vid = ffmpeg.input(game_mp4_filename)

    output_main_vid = output_mp4_filename + "_main_crop.mp4"
    output_game_vid = output_mp4_filename + "_game_crop.mp4"

    mainVid = (
        input_main_vid
        .filter('crop', m, m)
        .output(output_main_vid)
        .overwrite_output()
        .run()
    )

    gameVid = (
        input_game_vid
        .trim(duration=duration)
        .filter('crop', m, m)
        .output(output_game_vid)
        .overwrite_output()
        .run()
    )

    return (output_main_vid, output_game_vid)


# Pad video and export an accordingly named mp4 file
def padVid(mp4_filename, output_mp4_filename):
    PAD_OPTIONS = {
        'width': 'iw',
        'height': 'ih+30',
        'x': '0',
        'y': 'ih',
        'color': 'Black'
    }

    (
        ffmpeg.input(mp4_filename)
        .filter("pad", **PAD_OPTIONS)
        .output(output_mp4_filename)
        .run()
    )

    return output_mp4_filename


# Vertically stack two videos with padding inbetween and export an accordingly named mp4 file
def combineVids(top_mp4_filename, bottom_mp4_filename, output_mp4_filename, padding=False):
    if (padding):
        top_mp4_filename = padVid(
            top_mp4_filename, "padded_" + top_mp4_filename)
        bottom_mp4_filename = padVid(
            bottom_mp4_filename, "padded_" + bottom_mp4_filename)

    (
        ffmpeg.input(top_mp4_filename)
        .filter('vstack')
        .output(output_mp4_filename)
        .global_args('-i', bottom_mp4_filename)
        .run()
    )

    if (padding):
        # Delete the padded files after combining them
        os.remove(top_mp4_filename)
        os.remove(bottom_mp4_filename)

    return output_mp4_filename


font_path = "assets/fonts"
font_name = "Mercadillo Black"


def addAudioSubtitles(mp4_filename, mp3_filename, srt_filename, font_name, font_path, output_mp4_filename):
    style = "FontName=" + font_name + \
        ",FontSize=20,Alignment=10,PrimaryColour=&H03fcff,Outline=1"
    input_video = ffmpeg.input(mp4_filename)
    input_audio = ffmpeg.input(mp3_filename)

    (
        ffmpeg.concat(input_video, input_audio, v=1, a=1)
        .filter("subtitles", srt_filename, fontsdir=font_path, force_style=style)
        .output(output_mp4_filename)
        .run()
    )

    return output_mp4_filename


# Main Function
def videoProcessing(main_video, game_video, mp3_filename, subtitle_filename, output_name):
    if (game_video != "none"):
        print("Trimming gameplay and cropping videos.")
        cropped_main_video, cropped_game_video = trimCropVids(
            main_video, game_video, output_name)

        print("Combining videos.")
        comb_video = combineVids(
            cropped_main_video, cropped_game_video, output_name + '_combined.mp4', padding=False)

        # Delete cropped videos
        os.remove(cropped_main_video)
        os.remove(cropped_game_video)

        print("Adding subtitles to the video.")
        final_video = addAudioSubtitles(
            comb_video, mp3_filename, subtitle_filename, font_name, font_path, output_name + '.mp4')

        # Delete subtitles, mp3 and combined video
        os.remove(subtitle_filename)
        os.remove(mp3_filename)
        os.remove(comb_video)

    else:
        print("Adding subtitles to the video.")
        final_video = addAudioSubtitles(
            main_video, mp3_filename, subtitle_filename, font_name, font_path, output_name + '.mp4')

    os.remove(subtitle_filename)

    aa = 'fasdf'
    os.remove(mp3_filename)

    return final_video
