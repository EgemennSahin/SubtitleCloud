import React from "react";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import Sidebar from "@/components/navigation/side-bar";
import BottomNavigation from "@/components/navigation/bottom-bar";
import VideoPlayer from "@/components/video/video-player";
import { DashboardPage } from "@/components/navigation/dashboard-page";
import { redirect } from "next/dist/server/api-utils";
import { VideoControls } from "@/components/video/video-controls";

export default function GeneratedVideoPage({
  video_url,
  video_id,
}: {
  video_url: string;
  video_id: string;
}) {
  return (
    <>
      <Seo
        title="Subtitled Video"
        description="Subtitled video upload with download and share options."
      />
      <DashboardPage
        title="Subtitled Video"
        subtitle={<span className="linear-wipe">Your video is ready.</span>}
      >
        <div className="col-span-2 flex flex-col items-center  space-y-3">
          <VideoPlayer src={video_url} />
          <VideoControls
            src={video_url}
            folder="output"
            video_id={video_id}
            title={""}
          />
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

    const { video_url } = context.query;

    if (!video_url) {
      return {
        redirect: {
          destination: "/upload-video",
          permanent: false,
        },
      };
    }

    return {
      props: {
        video_url,
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
