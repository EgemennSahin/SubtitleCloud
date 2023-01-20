from audioProcessing import audioProcessing
from videoProcessing import videoProcessing
import argparse



def mainFunction(main_video, game_video, output_video):
  # Get the output_name
  output_name = output_video.split('.')[0]

  # Create mp3 and subtitles
  mp3_filename, subtitle_filename = audioProcessing(main_video, output_name)

  # TODO: ALLOW USER TO EDIT SRT FILE HERE WHILE EDITING STARTS
  # AND ADD AUDIO AND SUBTITLES AFTER USER FINISHES EDITING SRT FILE
  

  # Edit video
  edited_video = videoProcessing(main_video, game_video, mp3_filename, subtitle_filename, output_name)

  return edited_video


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument("--input", "-i", type=str, nargs=3)
  args = parser.parse_args()
  main_video = args.input[0]
  game_video = args.input[1]
  output_video = args.input[2]

  print(f"Main video: {main_video} \nGame video: {game_video} \nOutput video: {output_video}")

  mainFunction(main_video, game_video, output_video)


if __name__ == "__main__":
  main()