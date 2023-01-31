import React, { useState, useEffect } from "react";
import { storage } from "@/configs/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { ref, listAll, getDownloadURL } from "firebase/storage";

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
      <h1>Videos uploaded by {user?.email}</h1>
      <ul>
        {videos.map((video, index) => (
          <li key={index}>
            <video src={video} controls />
          </li>
        ))}
      </ul>
    </>
  );
};

export default VideoList;
