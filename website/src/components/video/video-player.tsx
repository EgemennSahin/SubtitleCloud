import { useRef } from "react";

export default function VideoPlayer({
  src,
  other,
  subtitles,
  setTime,
}: {
  src: string;
  other?: string;
  subtitles?: string;
  setTime?: (time: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Gets the current time of the video in seconds
  function getCurrentTime(): number {
    return videoRef?.current ? videoRef.current.currentTime : 0;
  }

  function handleTimeUpdate() {
    if (setTime) {
      setTime(getCurrentTime() * 1000);
    }
  }

  return (
    <div className="flex h-full flex-col items-center">
      <div className="relative w-1/2 rounded-xl bg-slate-300 bg-opacity-60 p-1">
        <video
          className="rounded-lg"
          ref={videoRef}
          controls
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
        >
          <source
            src={
              other == "upload" ? src : `${src}${other != "upload" && "#t=0.1"}`
            }
          />

          {subtitles && (
            <track
              label="English"
              kind="subtitles"
              src={URL.createObjectURL(
                new Blob([subtitles as BlobPart], {
                  type: "text/html",
                })
              )}
              default
            />
          )}
        </video>
      </div>
    </div>
  );
}
