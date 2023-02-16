import React, { useState, useEffect } from "react";
import { storageUploads } from "@/configs/firebase/firebaseConfig";
import { useAuth } from "@/configs/firebase/AuthContext";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import VideoPlayer from "./VideoPlayer";

const VideoList = (props: { isOutput: boolean }) => {
  const [videos, setVideos] = useState<Array<string>>([]);
  const { user } = useAuth();
  const videoRef = props.isOutput
    ? ref(storageUploads, `videos/${user?.uid}/outputs`)
    : ref(storageUploads, `videos/${user?.uid}/uploads`);

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
      <div className="flex h-screen flex-col items-center justify-center">
        <ul className="grid grid-cols-4 gap-8 p-16 text-center">
          {videos.map((video, index) => (
            <li className="flex items-center justify-center" key={index}>
              <video
                className="h-64 w-full bg-slate-800"
                style={{ backgroundSize: `contain` }}
                src={video}
                controls
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default VideoList;
