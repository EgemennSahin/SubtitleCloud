import React, { useState } from "react";
import TextButton from "@/components/text-button";
import router from "next/router";
import { VideoPlayer } from "@/components/video-player";

export default function GeneratedVideoPage() {
  const { video_url } = router.query;
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const copyLinkToClipboard = () => {
    const websiteLink = window.location.href;
    navigator.clipboard.writeText(websiteLink);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000); // enable button after 2 seconds
  };

  async function downloadVideo() {
    const response = await fetch(video_url as string);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Shortzoo Captioned Video.mp4";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <>
      <Seo
        title="Subtitled Video"
        description="Subtitled video upload with download and share options."
      />
      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-400 to-slate-600 py-5 sm:py-9">
        <h2 className="mb-6 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-snug tracking-tighter text-transparent">
          Your video has been processed.
        </h2>
        <VideoPlayer src={video_url as string} />

        <div className="mt-4 flex gap-4">
          <TextButton
            size="small"
            color="secondary"
            text={isLinkCopied ? "Link copied" : "Copy Link"}
            onClick={copyLinkToClipboard}
            disabled={isLinkCopied}
          />

          <TextButton
            color="primary"
            size="small"
            text="Download"
            onClick={downloadVideo}
          />
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getToken({ context });

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: { uid: token.uid },
    };
  } catch (error) {
    return handleError(error);
  }
}
