import React from "react";
import TextButton from "@/components/TextButton";
import router from "next/router";
import { VideoPlayer } from "@/components/VideoPlayer";

const GeneratedVideo = () => {
  // Get the video ID from the URL
  const { video_url } = router.query;

  console.log(video_url);

  return (
    <div className="flex max-h-fit min-h-screen flex-col items-center justify-start bg-gradient-to-b from-slate-400 to-slate-600 py-5 sm:py-9">
      <div className="flex h-fit w-fit flex-col items-center justify-start px-5">
        <h2 className="mb-9 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-snug tracking-tighter text-transparent">
          Your video has been processed.
        </h2>
        <VideoPlayer src={video_url as string} />
      </div>
    </div>
  );
};

export default GeneratedVideo;
