import React from "react";
import Seo from "@/components/seo";

export default function DashboardPage({
  videos,
}: {
  videos: { title: string; video_id: string; url: string }[];
}) {
  return (
    <>
      <Seo
        title="Videos"
        description="Access your generated videos on our short video subtitling solution."
      />

      <div className="flex overflow-hidden rounded-lg bg-white">
        <Sidebar />
        <BottomNavigation />

        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Your videos
                </h1>
              </div>
              <VideoList videos={videos} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import VideoList from "@/components/video-list";
import Sidebar from "@/components/side-bar";
import BottomNavigation from "@/components/bottom-navigation";
import { getVideos } from "@/helpers/firebase";

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
    const videos = await getVideos({ uid: token.uid, folder: "output" });

    return {
      props: {
        uid: token.uid,
        videos,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
