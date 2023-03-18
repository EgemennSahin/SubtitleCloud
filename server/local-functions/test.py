import ffmpeg

# Find the smallest resolution in the combined 4 dimensions of the videos and return it
def find_smallest_dimension(main_mp4_filename):
    probe_main = ffmpeg.probe(main_mp4_filename)['streams'][0]

    # Find the smallest resolution
    return min(probe_main['width'], probe_main['height'])

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


main_mp4_filename = "test2.mp4"
game_mp4_filename = "game_video.mp4"
output_name = "testa"

trim_crop_videos(main_mp4_filename, game_mp4_filename, output_name)