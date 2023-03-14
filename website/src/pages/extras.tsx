import React from "react";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import VideoList from "@/components/video/video-list";
import Sidebar from "@/components/navigation/side-bar";
import BottomNavigation from "@/components/navigation/bottom-bar";
import { getVideos } from "@/helpers/firebase";
import Seo from "@/components/seo";
import UploadButton from "@/components/upload-button";
import { handleUpload } from "@/helpers/upload";
import { DashboardPage } from "@/components/navigation/dashboard-page";
import { ArrowRightIcon, FolderIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Extras({
  videos,
}: {
  videos: { title: string; video_id: string; url: string }[];
}) {
  return (
    <>
      <Seo
        title="Extras"
        description="Access your extra videos on our short video subtitling solution."
      />

      <DashboardPage
        title="Your videos"
        subtitle={
          <UploadButton
            size="medium"
            setFile={async (file: Blob) => {
              await handleUpload(file, "secondary");
            }}
            text="Upload an extra"
          />
        }
      >
        <div className="col-span-2 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <VideoList videos={videos} folder="output" />
        </div>
      </DashboardPage>
    </>
  );
}

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

    // Get videos
    const videos = await getVideos({ uid: token.uid, folder: "secondary" });

    return {
      props: {
        uid: token.uid,
        videos: videos.videoData,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
