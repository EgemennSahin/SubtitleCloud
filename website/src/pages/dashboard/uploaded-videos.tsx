import BackButton from "@/components/BackButton";
import VideoList from "@/components/VideoList";
import React from "react";

const VideosPage = () => {
  return (
    <>
      <BackButton />
      <VideoList isOutput={false} />
    </>
  );
};

export default VideosPage;
