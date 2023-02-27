import UploadButton from "@/components/upload-button";
import React, { useEffect } from "react";
import TextButton from "@/components/text-button";
import { getMetadata, ref } from "firebase/storage";
import { tempStorage } from "@/config/firebase";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/router";
import Head from "next/head";
import { handleUpload } from "@/helpers/processing";

export default function ProcessVideoPage({ uid }: { uid: string }) {
  const router = useRouter();
  const { video_id } = router.query;

  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedVideo, setUploadedVideo] = React.useState<string | null>();
  const [processingVideo, setProcessingVideo] = React.useState(false);
  const [processedVideo, setProcessedVideo] = React.useState<string | null>();

  const [token, setToken] = React.useState<string | null>();
  const [gettingToken, setGettingToken] = React.useState(false);

  // Process video if it is uploaded and token is received
  useEffect(() => {
    // Process video
    async function handleVideoProcessing() {
      if (!uploadedVideo || !token) {
        console.log("Wrong parameters");
        return;
      }

      console.log("Starting video processing...");

      // Check if video is uploaded to the google cloud storage bucket
      const videoRef = ref(tempStorage, "uploads/" + uploadedVideo);

      const videoExists = await getMetadata(videoRef);

      if (!videoExists) {
        console.log("Error getting video");
        return;
      }

      try {
        setProcessingVideo(true);

        const response_video_processing = await fetch(
          "https://public-process-api-gateway-6dipdkfs.uc.gateway.dev/subtitle?key=AIzaSyA8gNrXERBjLwY8MlAGNYawoQgfzbhdRYY",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              video_id: uploadedVideo,
              token: token,
            }),
          }
        );

        const data = await response_video_processing.json();
        console.log("Cloud function invoked: ", data);

        if (data.url) {
          setProcessedVideo(data.url);
        } else {
          setProcessedVideo(null);
        }

        setUploadedVideo(null);
        setProcessingVideo(false);

        return true;
      } catch (error: any) {
        console.log("Error processing video: ", error.message);

        setProcessingVideo(false);
        return false;
      }
    }

    if (uploadedVideo != null && token != null) {
      handleVideoProcessing();
    }
  }, [uploadedVideo, token]);

  // Redirect to video page if video is processed
  useEffect(() => {
    if (processedVideo != null) {
      

      router.push({
        pathname: `/content/${uploadedVideo}`,
        query: { video_url: processedVideo },
      });
    }
  }, [processedVideo, router, uploadedVideo]);

  return (
    <>
      <Head>
        <title>Process Video - Shortzoo</title>
        <meta
          name="description"
          content="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
        />
      </Head>

      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-200 to-slate-400 py-5 sm:py-9">
        {processingVideo || uploading ? (
          <div className="flex h-fit w-fit flex-col items-center justify-start px-5">
            <h2 className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
              Your video is being processed.
            </h2>

            <div className="loader mb-16 h-56 w-56" />

            <h3 className="text-md linear-wipe mb-8 px-4 text-center sm:hidden ">
              This may take a few minutes. Please do not close the window or
              navigate away from this page.
            </h3>

            <h3 className="text-md linear-wipe mb-8 hidden px-4 text-center sm:block ">
              This may take a few minutes.
            </h3>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="mb-8 bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text pr-1 text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
              Process your video
            </h2>

            <UploadButton
              size="large"
              setFile={(file: File) => {
                setFile(file);
              }}
              disabled={processingVideo || uploading}
            />

            <h3 className="text-md mt-7 text-center text-xl font-normal tracking-wide text-slate-800">
              Video duration must be less than 3 minutes.
            </h3>

            <div className="mt-6 flex items-center justify-center">
              <TextButton
                size="medium"
                onClick={async () => {
                  await handleUpload(file, uid, "main");
                }}
                text={"Submit"}
                disabled={!file || processingVideo || uploading}
              />
            </div>
          </div>
        )}

        {gettingToken && (
          <div style={{ position: "fixed", bottom: 0, right: 0 }}>
            <Turnstile
              className="mt-7"
              siteKey="0x4AAAAAAACiGkz1x1wcw2J9"
              scriptOptions={{ async: true, defer: true, appendTo: "head" }}
              onSuccess={(token: string) => {
                setToken(token);

                setTimeout(() => {
                  setGettingToken(false);
                }, 1000);
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
import { getIdToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { isPaidUser } from "@/helpers/stripe";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getIdToken({ context });

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

    const user = await getUser({ uid: token.uid });

    return {
      props: {
        uid: token.uid,
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
