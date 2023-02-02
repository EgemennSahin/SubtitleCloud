from audioProcessing import audioProcessing
from videoProcessing import simpleVideoProcessing
import argparse


def mainFunction(main_video):
    output_name = 'temp'
    # Create mp3 and subtitles
    mp3_filename, subtitle_filename = audioProcessing(main_video, output_name)
    # mp3_filename, subtitle_filename = ("test_audio.mp3", "test_audio.srt")

    # Edit video
    edited_video = simpleVideoProcessing(
        main_video=main_video, mp3_filename=mp3_filename, subtitle_filename=subtitle_filename, output_name=output_name)

    return edited_video


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", type=str, nargs=1)
    args = parser.parse_args()
    main_video = args.input[0]
    # game_video = args.input[1]
    # output_video = args.input[2]

    print(
        f"Main video: {main_video}")

    mainFunction(main_video)


if __name__ == "__main__":
    main()
