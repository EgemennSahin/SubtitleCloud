import React, { useState, useEffect } from "react";
import { storage } from "@/configs/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import VideoPlayer from "./VideoPlayer";

const VideoList = () => {
  const [videos, setVideos] = useState<Array<string>>([]);
  const { user } = useAuth();
  const videoRef = ref(storage, `videos/mp4/${user?.uid}`);

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
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1>Your videos</h1>
        <ul className="p-16 grid grid-cols-4 gap-8 text-center">
          {videos.map((video, index) => (
            <li className="flex items-center justify-center" key={index}>
              <VideoPlayer videoSource={video} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default VideoList;
