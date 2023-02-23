import React, { useState, useEffect } from "react";
import { storageUploads } from "@/configs/firebase/firebaseConfig";
import { useAuth } from "@/configs/firebase/AuthContext";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { VideoPlayer } from "./VideoPlayer";

const VideoList = () => {
  const [videos, setVideos] = useState<Array<string>>([]);
  const { user } = useAuth();
  const videoRef = ref(storageUploads, `videos/${user?.uid}/outputs`);

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
  }, [user, videoRef]);

  return (
    <ul className="grid grid-cols-4 gap-8">
      {videos.map((video, index) => (
        <li className="flex items-center justify-center" key={index}>
          <VideoPlayer src={video} />
        </li>
      ))}
    </ul>
  );
};

export default VideoList;
