import React from "react";
import TextButton from "@/components/TextButton";
import router from "next/router";
import ReactPlayer from "react-player";

const ProcessVideo = () => {
  // Get the video ID from the URL
  const { videoId } = router.query as { videoId: string };

  // Get the video URL from the video ID
  const url_prefix = "https://storage.googleapis.com/";
  const bucket_name = "short-zoo-temp-videos/";
  const processedVideoUrl =
    url_prefix + bucket_name + videoId.replace(/,/g, "%");

  function downloadVideo() {
    fetch(processedVideoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "Shortzoo Captioned Video.mp4";
        a.click();
      });
  }

  return (
    <div className="flex max-h-fit min-h-screen flex-col items-center justify-start bg-gradient-to-b from-slate-400 to-slate-600 py-5 sm:py-9">
      <div className="flex h-fit w-fit flex-col items-center justify-start px-5">
        <h2 className="mb-9 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-snug tracking-tighter text-transparent">
          Your video has been processed.
        </h2>
        <ReactPlayer
          className="mb-7"
          url={processedVideoUrl}
          controls={true}
          width="fit"
        />

        <div>
          <TextButton
            size="medium"
            onClick={() => {
              downloadVideo();
            }}
            text={"Download"}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessVideo;
