import React from "react";
import { VideoPlayer } from "./video-player";

export default function VideoList({
  videos,
}: {
  videos: { title?: string; video_id: string; url: string }[];
}) {
  return (
    <>
      <ul className=" grid grid-cols-1 gap-y-12 pb-16 md:grid-cols-2 md:gap-y-16 xl:grid-cols-3">
        {videos.map((video, index) => (
          <li className="flex items-center justify-center" key={index}>
            <VideoPlayer size="small" title={video.title} src={video.url} />
          </li>
        ))}
      </ul>
    </>
  );
}
