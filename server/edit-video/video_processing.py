import subprocess
import ffmpeg
import os

# Find the smallest resolution in the combined 4 dimensions of the videos and return it
def find_smallest_dimension(main_mp4_filename):
    probe_main = ffmpeg.probe(main_mp4_filename)['streams'][0]

    # Find the smallest resolution
    return min(probe_main['width'], probe_main['height'])

def create_mp3(mp4_filename, output_name):
    print("Creating mp3")
    
    output = output_name + ".mp3"

    cmd = ['ffmpeg', '-i', mp4_filename, '-vn', '-preset', 'ultrafast', output]
    subprocess.call(cmd)

    return output

# Trim and crop in the same workflow to reduce runtime
def trim_crop_videos(main_mp4_filename, game_mp4_filename, output_name):
    outputs = (output_name + "_main.mp4", output_name + "_game.mp4")

    # Get the main video's length
    duration_main = ffmpeg.probe(main_mp4_filename)["format"]["duration"]

    main_dim = find_smallest_dimension(main_mp4_filename)
    game_dim = find_smallest_dimension(game_mp4_filename)

    input_main_vid = ffmpeg.input(main_mp4_filename)
    (
        input_main_vid
        .filter('crop', main_dim, main_dim)
        .output(outputs[0], preset="ultrafast")
        .overwrite_output()
        .run()
    )
    
    input_game_vid = ffmpeg.input(game_mp4_filename)
    (
        input_game_vid
        .trim(duration=duration_main)
        .filter('crop', game_dim, game_dim)
        .output("tmp/game_cropped.mp4", preset="ultrafast")
        .overwrite_output()
        .run()
    )

    (
        ffmpeg.input("tmp/game_cropped.mp4")
        .filter('scale', main_dim, main_dim)
        .output(outputs[1], preset="ultrafast")
        .overwrite_output()
        .run()
    )

    os.remove("tmp/game_cropped.mp4")

    return outputs


# Vertically stack two videos with padding inbetween and export an accordingly named mp4 file
def combine_videos(top_mp4_filename, bottom_mp4_filename, output_name):
    output = output_name + "_combined.mp4"
    (
        ffmpeg.input(top_mp4_filename)
        .filter('vstack')
        .output(output, vsync=2, preset="ultrafast")
        .overwrite_output()
        .global_args('-i', bottom_mp4_filename)
        .run()
    )

    return output


def add_audio_subtitles(mp4_filename, mp3_filename, srt_filename, output_name):
    output = output_name + "_subtitled.mp4"
    style = "FontName=Mercadillo Black,FontSize=20,Alignment=10,PrimaryColour=&H03fcff,Outline=1"
    input_video = ffmpeg.input(mp4_filename)
    input_audio = ffmpeg.input(mp3_filename)

    (
        ffmpeg.concat(input_video, input_audio, v=1, a=1)
        .filter("subtitles", srt_filename, fontsdir="fonts", force_style=style)
        .output(output, preset="ultrafast")
        .overwrite_output()
        .run()
    )

    return output


# Main Function
def process_video(main_video, game_video, subtitle_filename, output_name):
    mp3_filename = create_mp3(main_video, output_name)

    if (game_video != ""):
        print("Trimming gameplay and cropping videos.")
        crop_main, crop_game = trim_crop_videos(main_video, game_video, output_name)

        print("Combining videos.")
        main_video = combine_videos(crop_main, crop_game, output_name)

        os.remove(crop_main)
        os.remove(crop_game)

    print("Adding subtitles to the video.")
    final = add_audio_subtitles(main_video, mp3_filename, subtitle_filename, output_name)

    return final
