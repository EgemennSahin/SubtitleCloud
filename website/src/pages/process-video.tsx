import React, { useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/router";
import Seo from "@/components/seo";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { handleTranscribe } from "@/helpers/processing";
import { DashboardPage } from "@/components/navigation/dashboard-page";

export default function ProcessVideoPage({
  video_id,
  uid,
}: {
  video_id: string;
  uid: string;
}) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>();

  async function handler() {
    if (!token) {
      return;
    }

    try {
      const transcribeData = await handleTranscribe(uid, video_id, token);

      console.log("Finished");

      // Redirect to edit-subtitles with the transcribe data
      router.push({
        pathname: "/edit-video",
        query: {
          video_id: video_id,
          download_transcript: transcribeData?.download_url,
          upload_transcript: transcribeData?.upload_url,
        },
      });
    } catch (error) {
      console.error(error);
      router.push("/");
    }
  }

  // Process video if it is uploaded and token is received
  useEffect(() => {
    handler();
  }, [token]);

  return (
    <>
      <Seo
        title="Process Video"
        description="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
      />
      <DashboardPage
        title="Processing video"
        subtitle={
          <span className="linear-wipe">
            This may take a few minutes. Please do not close the window or
            navigate away from this page.
          </span>
        }
      >
        <div className="loader col-span-2 h-56 w-56" />
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
