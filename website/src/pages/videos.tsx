import React from "react";
import Seo from "@/components/seo";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import VideoList from "@/components/video/video-list";
import Sidebar from "@/components/navigation/side-bar";
import BottomNavigation from "@/components/navigation/bottom-bar";
import { getVideos } from "@/helpers/firebase";
import Link from "next/link";
import { ArrowRightIcon, FolderIcon } from "@heroicons/react/24/solid";

export default function Videos({
  videos,
  nextPageToken,
}: {
  videos: { title: string; video_id: string; url: string }[];
  nextPageToken: string;
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
              <div className="mx-auto  max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Your videos
                </h1>
                <div className="flex items-center justify-center gap-4 px-4">
                  {nextPageToken ? (
                    <Link
                      className="btn-secondary"
                      href={`/videos?page=${nextPageToken}`}
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                  ) : (
                    videos.length > 3 && (
                      <Link className="btn-secondary" href={`/videos?`}>
                        <FolderIcon className="h-5 w-5" />
                      </Link>
                    )
                  )}
                </div>
              </div>
              <VideoList videos={videos} folder="output" />
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

    // Get the page from the query
    const { page } = context.query;

    const pageToken = page?.toString();

    // Get videos
    const videos = await getVideos({
      uid: token.uid,
      folder: "output",
      pageToken: pageToken,
    });

    return {
      props: {
        uid: token.uid,
        videos: videos.videoData,
        nextPageToken: videos.nextPageToken || null,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}

// Start with no prevPage and nextPage
// Get this page's token, or null if it's the first page
// Go to nextPage, set this page's token as its prevPage
