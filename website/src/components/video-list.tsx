import React, { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { VideoPlayer } from "./video-player";
import { premiumStorage } from "@/config/firebase";
import { getVideos } from "@/helpers/firebase";
import Dropdown, { DropdownOption } from "./dropdown-menu";

export default function VideoList({
  uid,
  folder,
}: {
  uid: string;
  folder: string;
}) {
  const [videos, setVideos] = useState<
    { title: string | undefined; url: string }[]
  >([]);
  const storageRef = ref(premiumStorage, `${folder}/${uid}`);

  useEffect(() => {
    getVideos(storageRef).then((videoUrls) => {
      setVideos(videoUrls);
    });
  }, [uid, storageRef]);

  return (
    <>
      <ul className="flex flex-col gap-16 pb-16 md:gap-8 lg:flex-row">
        {videos.map((video, index) => (
          <li className="flex items-center justify-center" key={index}>
            <VideoPlayer size="small" src={video.url} />
          </li>
        ))}
      </ul>
    </>
  );
}
