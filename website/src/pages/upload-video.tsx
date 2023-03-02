import UploadButton from "@/components/upload-button";
import React, { useState } from "react";
import TextButton from "@/components/text-button";
import { useRouter } from "next/router";
import { handleUpload } from "@/helpers/upload";
import Seo from "@/components/seo";

export default function UploadVideo() {
  const router = useRouter();

  const [file, setFile] = useState<Blob | null>(null);
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <Seo
        title="Upload Video"
        description="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
      />

      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-200 to-slate-400 py-5 sm:py-9">
        <div className="flex flex-col items-center">
          <h2 className="mb-4 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text pr-1 text-5xl font-bold leading-tight tracking-tighter text-transparent">
            Upload your video
          </h2>

          {!file ? (
            <div className="flex flex-col items-center gap-4">
              <UploadButton size="large" setFile={setFile} disabled={false} />

              <h3 className="text-md mt-7 text-center text-xl font-normal tracking-wide text-slate-800">
                Video duration must be less than 3 minutes.
              </h3>
            </div>
          ) : (
            <div className="flex flex-col items-center  gap-4">
              <VideoPlayer size="small" src={URL.createObjectURL(file)} />
              <UploadButton
                size="medium"
                setFile={setFile}
                text="Upload"
                disabled={false}
              />
            </div>
          )}

          <div className="mt-6 flex items-center justify-center">
            <TextButton
              color="primary"
              size="medium"
              onClick={async () => {
                setPressed(true);
                const video_id = await handleUpload(file, "main");

                if (!video_id) {
                  setFile(null);
                  setPressed(false);
                  return;
                }

                // Push to processing page with file id
                router.push({
                  pathname: "/process-video",
                  query: { video_id: video_id },
                });
              }}
              text={"Process video"}
              disabled={!file || pressed}
            />
          </div>
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { isPaidUser } from "@/helpers/stripe";
import { VideoPlayer } from "@/components/video-player";

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

    return {
      props: {
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
