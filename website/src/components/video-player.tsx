import { useState, useRef, useEffect } from "react";
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
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Gets the current time of the video in seconds
  function getCurrentTime(): number {
    return videoRef.current ? videoRef.current.currentTime : 0;
  }

  // Gets the total duration of the video in seconds
  function getDuration(): number {
    return videoRef.current ? videoRef.current.duration : 100;
  }

  function getWatchedPercentage(): number {
    const percentage = (getCurrentTime() / getDuration()) * 100;

    if (percentage > 99) {
      setIsFinished(true);
    }
    return percentage;
  }

  let width = "w-64";
  let barHeight = "h-1";
  let iconSize = "h-6 w-6";

  switch (size) {
    case "small":
      width = "w-48";
      barHeight = "h-1";
      iconSize = "h-8 w-8";
      break;
    case "medium":
      width = "w-72";
      barHeight = "h-2";
      iconSize = "h-10 w-10";
      break;
    case "large":
      width = "w-96";
      barHeight = "h-3";
      iconSize = "h-14 w-14";
      break;
    default:
      width = "w-72";
      barHeight = "h-2";
      iconSize = "h-10 w-10";
      break;
  }

  return (
    <div className="relative">
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
        <div className={`${barHeight} ${width} bg-slate-300 outline-none`}>
          <div
            className={`${barHeight} bg-gradient-to-r from-teal-400 to-blue-400`}
            style={{
              width: `${getWatchedPercentage()}%`,
              transition: "width 1s linear",
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
  );
};
