import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";
import Seo from "@/components/seo";
import { handleVideoProcessing } from "@/helpers/processing";

export default function AddToVideoPage({
  video_url,
  uid,
}: {
  video_url: string;
  uid: string;
}) {
  const router = useRouter();
  const [processState, setProcessState] = useState<
    "None" | "Processing" | "Done"
  >("None");

  // Process video if it is uploaded and token is received
  useEffect(() => {
    async function handler() {
      if (processState != "None") return;
      setProcessState("Processing");
      try {
        const transcribeData = await handleVideoProcessing(video_url, "", uid);
        console.log(transcribeData);

        // Redirect to edit-subtitles with the transcribe data
        router.push({
          pathname: "/video",
          query: {
            video_url: transcribeData.url,
          },
        });
      } catch (error) {
        console.error(error);
      }
      setProcessState("Done");
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
            Your video is being processed.
          </h2>

          <Spinner size="large" />

          <h3 className="text-md linear-wipe my-8 px-4 text-center sm:hidden ">
            This may take a few minutes. Please do not close the window or
            navigate away from this page.
          </h3>

          <h3 className="text-md linear-wipe my-8 hidden px-4 text-center sm:block ">
            This may take a few minutes.
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
        video_url: video_url,
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
