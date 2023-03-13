import { useState, useRef, useEffect, MouseEvent } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ArrowPathIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Modal } from "../modal";
import { useRouter } from "next/router";
import { parseSync } from "subtitle";

export const VideoPlayer = ({
  src,
  size,
  hideControls,
  title,
  other,
  folder,
  video_id,
  subtitles,
  setTime,
}: {
  src: string;
  size?: "small" | "medium" | "large";
  hideControls?: boolean;
  title?: string;
  other?: string;
  folder?: string;
  video_id?: string;
  subtitles?: string;
  setTime?: (time: number) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const { ModalElement, closeModal, openModal } = Modal(
    "Video copied to clipboard!"
  );
  const [currentSubtitle, setCurrentSubtitle] = useState("");

  const router = useRouter();

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
    navigator.clipboard.writeText(src);
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

  var parsedSubtitles = parseSync(subtitles || "") || [];

  const handleTimeUpdate = () => {
    if (!subtitles) {
      return;
    }

    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    // Find the subtitle that should be displayed at the current time
    const subtitle = parsedSubtitles.find((subtitle) => {
      if (subtitle.type != "cue") {
        return;
      }
      const currentTime = videoElement.currentTime * 1000;
      if (setTime) {
        setTime(currentTime);
      }

      return (
        currentTime >= subtitle.data.start && currentTime <= subtitle.data.end
      );
    });

    // Update the current subtitle state
    if (subtitle) {
      if (subtitle.type != "cue") {
        return;
      }
      setCurrentSubtitle(subtitle.data.text);
    } else {
      setCurrentSubtitle("");
    }
  };

  const renderSubtitles = () => {
    const subtitleElement = subtitleRef.current;

    if (!subtitleElement) {
      return;
    }

    subtitleElement.innerText = currentSubtitle;

    requestAnimationFrame(renderSubtitles);
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    requestAnimationFrame(renderSubtitles);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef, currentSubtitle]);

  return (
    <div
      className="flex h-full flex-col items-center"
      onMouseEnter={(e) => setShowControls(true)}
      onMouseLeave={(e) => setShowControls(false)}
    >
      <h1 className="mb-3 text-center text-lg font-semibold">{title}</h1>

      <div className="relative w-2/3 rounded-xl bg-slate-300 bg-opacity-60 p-1 sm:hidden">
        <video
          className="rounded-lg"
          ref={videoRef}
          src={
            other == "upload" ? src : `${src}${other != "upload" && "#t=0.1"}`
          }
          controls
          preload="metadata"
        />
        {subtitles && (
          <div className="h-fit">
            <div className="flex items-center justify-center">
              <div
                className="w-fit rounded-lg bg-blue-500 bg-opacity-70 px-4 py-2 text-center text-white"
                ref={subtitleRef}
              />
            </div>
          </div>
        )}
      </div>

      <div className="relative hidden h-full w-fit items-center justify-center rounded-xl bg-slate-300 bg-opacity-60 p-1 sm:flex">
        <video
          ref={videoRef}
          src={src}
          className={`${width} rounded-lg`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onClick={handlePlayPause}
        />
        {subtitles && (
          <div className="absolute inset-x-0 top-1 h-fit">
            <div className="flex items-center justify-center">
              <div
                className="w-fit rounded-lg bg-blue-500 bg-opacity-70 px-4 py-2 text-center text-white"
                ref={subtitleRef}
              />
            </div>
          </div>
        )}

        {showControls && (
          <>
            <button
              className="absolute top-2 right-2 rounded-3xl bg-slate-500 bg-opacity-30 p-2 text-slate-50 hover:bg-slate-700 hover:bg-opacity-20 hover:text-slate-200"
              onClick={handleMuteUnmute}
            >
              {isMuted ? (
                <SpeakerXMarkIcon className={iconSize} />
              ) : (
                <SpeakerWaveIcon className={iconSize} />
              )}
            </button>

            <div className="absolute bottom-1 flex flex-col">
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
          </>
        )}
      </div>

      {!hideControls && (
        <>
          <div className="mt-4 flex gap-4">
            <ModalElement />
            <button
              onClick={() => {
                copyLinkToClipboard();
                openModal();
              }}
              className="btn-secondary"
            >
              <ShareIcon className="h-6 w-6" />
            </button>
            <button
              onClick={downloadVideo}
              className="focus:ring-offset-2; block transform items-center rounded-xl bg-blue-600 px-10 py-3 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <ArrowDownTrayIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={async () => {
                await fetch("/api/delete-video", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    folder,
                    video_id,
                  }),
                });

                router.reload();
              }}
              className="focus:ring-offset-2; block transform items-center rounded-xl bg-red-600 px-10 py-3 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
