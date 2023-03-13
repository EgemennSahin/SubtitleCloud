import UploadButton from "@/components/upload-button";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { handleUpload } from "@/helpers/upload";
import Seo from "@/components/seo";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Sidebar from "@/components/navigation/side-bar";
import BottomNavigation from "@/components/navigation/bottom-bar";
import { VideoPlayer } from "@/components/video/video-player";

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

      <div className="flex overflow-hidden bg-white">
        <Sidebar />
        <BottomNavigation />

        <div className="relative flex flex-1 flex-col items-center gap-6 px-4 pt-6 pb-24 sm:px-6 md:px-8">
          <h1 className="text-3xl text-neutral-600">Upload your video</h1>

          <h2 className="text-md w-96 text-xl font-normal tracking-wide text-slate-800">
            Your video must contain audio and be less than 3 minutes long.
          </h2>

          <div className="flex flex-col items-center justify-center gap-2">
            {!file ? (
              <UploadButton size="large" setFile={setFile} disabled={false} />
            ) : (
              <>
                <VideoPlayer
                  size="small"
                  src={URL.createObjectURL(file)}
                  hideControls
                  other="upload"
                />
                <UploadButton
                  size="medium"
                  setFile={setFile}
                  text="Change upload"
                  disabled={false}
                />
              </>
            )}
          </div>
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
            className="btn-primary w-32 self-center"
          >
            Process video
          </button>
        </div>
      </div>
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

    return {
      props: {
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
