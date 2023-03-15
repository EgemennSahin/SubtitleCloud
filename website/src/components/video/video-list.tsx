import { VideoControls } from "./video-controls";
import VideoPlayer from "./video-player";

export default function VideoList({
  videos,
  folder,
}: {
  videos: { title?: string; video_id: string; url: string }[];
  folder: string;
}) {
  return (
    <>
      <ul className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-y-16 xl:grid-cols-3">
        {videos.map((video) => (
          <li
            className="flex flex-col items-center space-y-3"
            key={video.video_id}
          >
            <h1 className="w-64 overflow-hidden text-ellipsis whitespace-nowrap pb-1 text-center text-lg font-semibold">
              {video.title}
            </h1>

            <VideoPlayer src={video.url} />

            <VideoControls
              src={video.url}
              folder={folder}
              video_id={video.video_id}
              title={video.title || ""}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
