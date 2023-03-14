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
import { DashboardPage } from "@/components/navigation/dashboard-page";

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

      <DashboardPage title="Your videos" subtitle="See your generated videos.">
        <div className="col-span-2 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
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
