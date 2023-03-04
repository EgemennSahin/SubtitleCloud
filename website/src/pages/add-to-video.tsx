import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";
import Seo from "@/components/seo";
import { handleVideoProcessing } from "@/helpers/processing";

export default function AddToVideoPage({
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
  }, []);

  return (
    <>
      <Seo
        title="Process Video"
        description="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
      />
      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-200 to-slate-400 py-5 sm:py-9">
        <div className="flex h-fit w-fit flex-col items-center justify-start px-5">
          <h2 className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
            Your video is being edited.
          </h2>

          <Spinner size="large" />

          <h3 className="text-md linear-wipe my-8 px-4 text-center">
            <span className="sm:hidden">
              This may take a few minutes. Please do not close the window or
              navigate away from this page.
            </span>
            <span className="hidden sm:block">
              This may take a few minutes.
            </span>
          </h3>
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { isPaidUser } from "@/helpers/stripe";

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

    if (!isPaidUser({ token })) {
      return {
        redirect: {
          destination: "/premium",
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
