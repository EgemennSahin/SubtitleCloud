import React, { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { VideoPlayer } from "./video-player";
import { premiumStorage } from "@/config/firebase";

export default function VideoList({ uid }: { uid: string }) {
  const [videos, setVideos] = useState<Array<string>>([]);
  const videoRef = ref(premiumStorage, `output/${uid}`);

  useEffect(() => {
    listAll(videoRef)
      .then((res) => {
        const promises = res.items.map((item) => {
          return getDownloadURL(item);
        });
        Promise.all(promises).then((videoUrls) => {
          setVideos(videoUrls);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [uid, videoRef]);

  return (
    <ul className="grid grid-cols-4 gap-8">
      {videos.map((video, index) => (
        <li className="flex items-center justify-center" key={index}>
          <VideoPlayer size="small" src={video} />
        </li>
      ))}
    </ul>
  );
}
