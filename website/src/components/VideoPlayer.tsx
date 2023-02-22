import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

export const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteUnmute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false;
      } else {
        videoRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  const handleDownload = () => {
    if (videoRef.current) {
      fetch(src, {
        method: "GET",
        headers: {
          "Content-Type": "video/mp4",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error("Network response was not ok.");
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "video.mp4";
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch((error) => {
          console.error("Error downloading video:", error);
        });
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
    return videoRef.current ? videoRef.current.duration : 0;
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        className="w-64 rounded-lg"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onClick={handlePlayPause}
      />

      <button
        className="absolute top-1 right-1 rounded-3xl bg-slate-500 bg-opacity-30 p-2 text-slate-50 hover:bg-slate-900 hover:bg-opacity-50"
        onClick={handleMuteUnmute}
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="h-7 w-7" />
        ) : (
          <SpeakerWaveIcon className="h-7 w-7" />
        )}
      </button>

      <div className="absolute bottom-0 flex flex-col">
        <div className="h-2 w-64 bg-slate-300 outline-none">
          <div
            className="h-2 bg-gradient-to-r from-teal-400 to-blue-400"
            style={{
              width: `${(getCurrentTime() / getDuration()) * 100}%`,
              transition: "width 1s linear ",
            }}
          />
        </div>

        <div className="flex w-full items-center justify-between rounded-b-lg bg-slate-900 bg-opacity-50 px-3 pt-1">
          <button
            className="p-2 text-white hover:text-teal-400"
            onClick={handleDownload}
          >
            <ArrowDownTrayIcon className="h-6 w-6" />
          </button>
          <button
            className="p-2 text-white hover:text-slate-200"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <PauseIcon className="h-8 w-8" />
            ) : getCurrentTime() === getDuration() ? (
              <ArrowPathIcon className="h-8 w-8" />
            ) : (
              <PlayIcon className="h-8 w-8" />
            )}
          </button>
          <button
            className="p-2 text-white hover:text-slate-200"
            onClick={handleFullScreen}
          >
            <ArrowsPointingOutIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
