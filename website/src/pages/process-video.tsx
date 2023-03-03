import React, { useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";
import Seo from "@/components/seo";

export default function ProcessVideoPage({
  video_id,
  uid,
}: {
  video_id: string;
  uid: string;
}) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>();

  // Process video if it is uploaded and token is received
  useEffect(() => {
    async function handler(uid: string, video_id: string, token: string) {
      try {
        const transcribeData = await handleTranscribe(uid, video_id, token);

        // Redirect to edit-subtitles with the transcribe data
        router.push({
          pathname: "/edit-video",
          query: {
            video_id: video_id,
            download_transcript: transcribeData?.downloadUrl,
            upload_transcript: transcribeData?.uploadUrl,
          },
        });
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    }

    if (!token) {
      return;
    }

    handler(uid, video_id, token);
  }, [token]);

  return (
    <>
      <Seo
        title="Process Video"
        description="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
      />
      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-200 to-slate-400 py-5 sm:py-9">
        <div className="flex h-fit w-fit flex-col items-center justify-start px-5">
          <h2 className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
            Your video is being transcribed.
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
import { handleTranscribe } from "@/helpers/processing";

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
