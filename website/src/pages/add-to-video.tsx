import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Seo from "@/components/seo";
import { handleVideoProcessing } from "@/helpers/processing";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { DashboardPage } from "@/components/navigation/dashboard-page";

export default function AddToVideo({
  video_id,
  side_video_id,
  uid,
}: {
  video_id: string;
  side_video_id: string;
  uid: string;
}) {
  const router = useRouter();

  // Process video if it is uploaded and token is received
  useEffect(() => {
    async function handler() {
      try {
        const videoData = await handleVideoProcessing(
          video_id,
          side_video_id,
          uid
        );

        // Redirect to edit-subtitles with the transcribe data
        router.push({
          pathname: "/video",
          query: {
            video_url: videoData.url,
          },
        });
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    }

    handler();
  });

  return (
    <>
      <Seo
        title="Process Video"
        description="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
      />
      <DashboardPage
        title="Editing video"
        subtitle={
          <span className="linear-wipe">
            This may take a few minutes. Please do not close the window or
            navigate away from this page.
          </span>
        }
      >
        <div className="loader col-span-2 h-56 w-56" />
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

    const { video_id, side_video_id } = context.query;

    if (!video_id) {
      return {
        redirect: {
          destination: "/upload-video",
          permanent: false,
        },
      };
    }

    return {
      props: {
        video_id,
        uid: token.uid,
        side_video_id,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
