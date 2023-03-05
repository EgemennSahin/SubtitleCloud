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

      <div className="flex overflow-hidden rounded-lg bg-white">
        <Sidebar />
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Upload your video
                </h1>

                {!file ? (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <UploadButton
                      size="large"
                      setFile={setFile}
                      disabled={false}
                    />

                    <h3 className="text-md mt-7 w-64 text-xl font-normal tracking-wide text-slate-800">
                      Video duration must be less than 3 minutes.
                    </h3>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <VideoPlayer
                      size="small"
                      src={URL.createObjectURL(file)}
                      hideControls
                    />
                    <UploadButton
                      size="medium"
                      setFile={setFile}
                      text="Change upload"
                      disabled={false}
                    />
                  </div>
                )}
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="py-4">
                  <div className="items-bottom mt-6 flex justify-center">
                    <button
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
                      className="btn-primary"
                    >
                      Process video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
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
import Sidebar from "@/components/side-bar";

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
