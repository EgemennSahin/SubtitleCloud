import React from "react";
import { VideoPlayer } from "./video-player";

export default function VideoList({
  videos,
  folder,
}: {
  videos: { title?: string; video_id: string; url: string }[];
  folder?: string;
}) {
  return (
    <>
      <ul className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-y-16 xl:grid-cols-3">
        {videos.map((video, index) => (
          <li className="flex items-center justify-center" key={index}>
            <VideoPlayer
              size="small"
              title={video.title}
              src={video.url}
              folder={folder}
              video_id={video.video_id}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
