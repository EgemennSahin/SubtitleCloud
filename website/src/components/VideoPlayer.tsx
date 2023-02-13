import React from "react";

interface Props {
  videoSource: string;
}

const VideoPlayer: React.FC<Props> = ({ videoSource }) => {
  return (
    <video
      className="w-full h-64 bg-slate-800"
      style={{ backgroundSize: `contain` }}
      src={videoSource}
      controls
    />
  );
};

export default VideoPlayer;
