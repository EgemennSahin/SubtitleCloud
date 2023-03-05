import { useState, useRef, useEffect, MouseEvent } from "react";
import { useRouter } from "next/router";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

export const VideoPlayer = ({
  src,
  size,
}: {
  src: string;
  size?: "small" | "medium" | "large";
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handlePlayPause = () => {
    if (!videoRef.current) {
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      setIsFinished(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteUnmute = () => {
    if (!videoRef.current) {
      return;
    }

    if (isMuted) {
      videoRef.current.muted = false;
    } else {
      videoRef.current.muted = true;
    }
    setIsMuted(!isMuted);
  };

  const handleFullScreen = () => {
    if (!videoRef.current) {
      return;
    }

    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Update the slider value as the video plays
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderValue(getCurrentTime());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Gets the current time of the video in seconds
  function getCurrentTime(): number {
    return videoRef?.current ? videoRef.current.currentTime : 0;
  }

  // Gets the total duration of the video in seconds
  function getDuration(): number {
    return videoRef?.current ? videoRef.current.duration : 100;
  }

  function getWatchedPercentage(): number {
    const percentage = (getCurrentTime() / getDuration()) * 100;

    if (percentage > 99) {
      setIsFinished(true);
    }
    return percentage;
  }

  async function downloadVideo() {
    const response = await fetch(src as string);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Shortzoo Captioned Video.mp4";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const copyLinkToClipboard = () => {
    const websiteLink = window.location.href;
    navigator.clipboard.writeText(websiteLink);
  };

  let width = "";
  let barHeight = "";
  let iconSize = "";

  switch (size) {
    case "small":
      width = "w-48";
      barHeight = "h-3";
      iconSize = "h-8 w-8";
      break;
    case "medium":
      width = "w-72";
      barHeight = "h-4";
      iconSize = "h-10 w-10";
      break;
    case "large":
      width = "w-96";
      barHeight = "h-6";
      iconSize = "h-14 w-14";
      break;
    default:
      width = "w-72";
      barHeight = "h-4";
      iconSize = "h-10 w-10";
      break;
  }

  const handleSliderMouseDown = (e: MouseEvent) => {
    console.log("Down", e);
    const sliderBar = e.currentTarget as HTMLElement;
    const boundingRect = sliderBar.getBoundingClientRect();
    const sliderBarWidth = boundingRect.width;
    const mouseX = e.clientX - boundingRect.left;
    const percentage = (mouseX / sliderBarWidth) * 100;
    console.log("Percentage:", percentage);
    const video = videoRef.current;
    if (video) {
      const duration = video.duration;
      const currentTime = (percentage / 100) * duration;
      video.currentTime = currentTime;
      setSliderValue(percentage);
      setIsDragging(true);
      setIsFinished(false);
    }
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false);
  };

  const handleSliderMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const sliderBar = e.currentTarget as HTMLElement;
      const boundingRect = sliderBar.getBoundingClientRect();
      const sliderBarWidth = boundingRect.width;
      const mouseX = e.clientX - boundingRect.left;
      const percentage = (mouseX / sliderBarWidth) * 100;
      const video = videoRef.current;

      if (video) {
        const duration = video.duration;
        const currentTime = (percentage / 100) * duration;
        video.currentTime = currentTime;
        setSliderValue(percentage);
        setIsFinished(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-fit w-fit">
        <video
          ref={videoRef}
          src={src}
          className={`${width} rounded-lg`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onClick={handlePlayPause}
        />

        <button
          className="absolute top-1 right-1 rounded-3xl bg-slate-500 bg-opacity-30 p-2 text-slate-50 hover:bg-slate-700 hover:bg-opacity-20 hover:text-slate-200"
          onClick={handleMuteUnmute}
        >
          {isMuted ? (
            <SpeakerXMarkIcon className={iconSize} />
          ) : (
            <SpeakerWaveIcon className={iconSize} />
          )}
        </button>

        <div className="absolute bottom-0 flex flex-col">
          <div
            className={`${barHeight} ${width} cursor-pointer bg-slate-300 outline-none`}
            onMouseDown={handleSliderMouseDown}
            onMouseUp={handleSliderMouseUp}
            onMouseMove={handleSliderMouseMove}
            onMouseLeave={handleSliderMouseUp}
          >
            <div
              className={`${barHeight} bg-gradient-to-r from-teal-400 to-blue-400`}
              style={{
                width: `${isFinished ? 100 : getWatchedPercentage()}%`,
                transition: isDragging ? "none" : "width 0.1s linear",
              }}
            />
          </div>

          <div className="flex w-full items-center justify-between rounded-b-lg bg-slate-900 bg-opacity-50 px-2 py-1">
            <button
              className="p-2 text-white hover:text-slate-300"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <PauseIcon className={iconSize} />
              ) : isFinished ? (
                <ArrowPathIcon className={iconSize} />
              ) : (
                <PlayIcon className={iconSize} />
              )}
            </button>
            <button
              className="p-2 text-white hover:text-slate-200"
              onClick={handleFullScreen}
            >
              <ArrowsPointingOutIcon className={iconSize} />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={copyLinkToClipboard} className="btn-secondary">
          Share
        </button>
        <button
          onClick={downloadVideo}
          className="focus:ring-offset-2; block transform items-center rounded-xl bg-blue-600 px-10 py-3 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Download
        </button>
      </div>
    </div>
  );
};
