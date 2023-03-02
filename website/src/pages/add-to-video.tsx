import React, { useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";
import Seo from "@/components/seo";

export default function AddToVideoPage({
  video_id,
  uid,
}: {
  video_id: string;
  uid: string;
}) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>();
  const [processState, setProcessState] = useState<
    "None" | "Processing" | "Done"
  >("None");

  // Process video if it is uploaded and token is received
  useEffect(() => {
    async function handler(uid: string, video_id: string, token: string) {
      if (processState != "None") return;
      setProcessState("Processing");
      try {
        const transcribeData = await handleVideoProcessing(video_id, "", uid);
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

    if (video_id != null && token != null) {
      handler(uid, video_id, token);
    }
  }, [video_id, token]);

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

        {!token && (
          <div style={{ position: "fixed", bottom: 0, right: 0 }}>
            <Turnstile
              className="mt-7"
              siteKey="0x4AAAAAAACiGkz1x1wcw2J9"
              scriptOptions={{ async: true, defer: true, appendTo: "head" }}
              onSuccess={(token: string) => {
                setToken(token);
              }}
              options={{
                cData: uid,
                size: "compact",
                theme: "light",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { isPaidUser } from "@/helpers/stripe";
import { handleTranscribe, handleVideoProcessing } from "@/helpers/processing";

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

    const { video_id } = context.query;

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
        video_id: video_id,
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
