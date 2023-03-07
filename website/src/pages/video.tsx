import React, { useState } from "react";
import TextButton from "@/components/text-button";
import { VideoPlayer } from "@/components/video-player";

export default function GeneratedVideoPage({
  video_url,
}: {
  video_url: string;
}) {
  return (
    <>
      <Seo
        title="Subtitled Video"
        description="Subtitled video upload with download and share options."
      />
      <div className="flex overflow-hidden rounded-lg bg-white">
        <Sidebar />
        <BottomNavigation />
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Your video
                </h1>
              </div>
              <div className="flex flex-col items-center">
                <VideoPlayer size="medium" src={video_url} />
              </div>
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
import Seo from "@/components/seo";
import Sidebar from "@/components/side-bar";
import BottomNavigation from "@/components/bottom-navigation";

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
