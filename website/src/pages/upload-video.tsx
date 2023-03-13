import UploadButton from "@/components/upload-button";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { handleUpload } from "@/helpers/upload";
import Seo from "@/components/seo";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { DashboardPage } from "@/components/navigation/dashboard-page";
import Instructions from "@/components/instructions";
import VideoPlayer from "@/components/video/video-player";

export default function UploadVideo() {
  const router = useRouter();

  const [file, setFile] = useState<Blob | null>(null);
  const [pressed, setPressed] = useState(false);

  const instructions = [
    "Contains audio",
    "Less than 1 minute",
    "Less than 100MB",
  ];
  return (
    <>
      <Seo
        title="Upload Video"
        description="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
      />
      <DashboardPage
        title="Upload video"
        subtitle={
          <Instructions title="Video Format" instructions={instructions} />
        }
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {!file ? (
            <UploadButton size="large" setFile={setFile} disabled={false} />
          ) : (
            <>
              <VideoPlayer src={URL.createObjectURL(file)} other="upload" />
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

    return {
      props: {
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
