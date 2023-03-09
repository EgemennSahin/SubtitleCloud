# Testing adding 2 audio inputs to video
import subprocess
import ffmpeg

def add_multiple_audio(input_video, input_audio, background_audio, output):
    cmd = ["ffmpeg", "-i", input_video, "-i", input_audio, "-i", background_audio, "-filter_complex", "[1]volume=0.05[a];[1][2]amix=inputs=2[b]", "-map", "0:v", "-map", "[a]", "-map", "[b]", "-c:v", "copy", "-shortest", output]
    subprocess.call(cmd)


input_video = "test2.mp4"
input_audio = "test2.mp3"
background_audio = "background.mp3"

add_multiple_audio(input_video, input_audio, background_audio, "testing_audio.mp4")