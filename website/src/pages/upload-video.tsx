import UploadButton from "@/components/upload-button";
import React from "react";
import TextButton from "@/components/text-button";
import { useRouter } from "next/router";
import Head from "next/head";
import { handleUpload } from "@/helpers/processing";

export default function UploadVideo({ uid }: { uid: string }) {
  const router = useRouter();

  const [file, setFile] = React.useState<File | null>(null);
  const [pressed, setPressed] = React.useState(false);

  return (
    <>
      <Head>
        <title>Upload Video - Shortzoo</title>
        <meta
          name="description"
          content="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
        />
      </Head>

      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-200 to-slate-400 py-5 sm:py-9">
        <div className="flex flex-col items-center">
          <h2 className="mb-8 bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text pr-1 text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
            Upload your video
          </h2>

          <UploadButton size="large" setFile={setFile} disabled={false} />

          <h3 className="text-md mt-7 text-center text-xl font-normal tracking-wide text-slate-800">
            Video duration must be less than 3 minutes.
          </h3>

          <div className="mt-6 flex items-center justify-center">
            <TextButton
              size="medium"
              onClick={async () => {
                setPressed(true);
                const video_id = await handleUpload(file, uid, "main");

                console.log("Video_id: ", video_id);

                if (!video_id) {
                  setFile(null);
                  setPressed(false);
                  return;
                }

                // Push to processing page with file id
                router.push({
                  pathname: "/process-video",
                  query: { video_id },
                });
              }}
              text={"Upload"}
              disabled={!file || pressed}
            />
          </div>
        </div>
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
