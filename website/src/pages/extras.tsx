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
            <div className="py-6 pb-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Your extras
                </h1>
                <div className="mb-8 flex justify-center">
                  <UploadButton
                    size="medium"
                    setFile={async (file: Blob) => {
                      const side_video_id = await handleUpload(
                        file,
                        "secondary"
                      );
                    }}
                    text="Upload an extra"
                  />
                </div>
              </div>

              <VideoList videos={videos} folder="secondary" />
            </div>
          </main>
        </div>
      </div>
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
