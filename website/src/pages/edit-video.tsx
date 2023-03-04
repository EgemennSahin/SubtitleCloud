import React from "react";
import TextButton from "@/components/text-button";
import { useRouter } from "next/router";
import Seo from "@/components/seo";
import { VideoPlayer } from "@/components/video-player";

export default function EditVideoPage({
  uid,
  video_url,
  video_id,
  download_transcript,
  upload_transcript,
}: {
  uid: string;
  video_url: string;
  video_id: string;
  download_transcript: string;
  upload_transcript: string;
}) {
  const router = useRouter();
  const [file, setFile] = React.useState<Blob | null>(null);

  return (
    <>
      <Seo
        title="Edit Subtitles"
        description="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
      />
      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-200 to-slate-400 py-5 sm:py-9">
        <h2 className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
          Edit Video
        </h2>

        <div className="grid grid-cols-2 items-center">
          <div className="flex flex-col items-center justify-center">
            <VideoPlayer src={video_url} size="medium" />
          </div>

          <div className="flex h-full flex-col items-center justify-start">
            <h3 className="text-style-subheader">Subtitles</h3>
            <SubtitleInput
              downloadUrl={download_transcript}
              uploadUrl={upload_transcript}
              uid={uid}
            />
          </div>

          <div className="mt-3 flex flex-col items-center justify-center">
            <UploadButton
              size="medium"
              setFile={setFile}
              text="Upload Secondary Video"
              disabled={false}
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <TextButton
            color="primary"
            size="medium"
            onClick={async () => {
              // Upload the secondary video
              const side_video_id = await handleUpload(file, "side");

              // Redirect to the video page
              router.push({
                pathname: "/add-to-video",
                query: {
                  video_id: video_id,
                  side_video_id: side_video_id,
                },
              });
            }}
            text={"Submit"}
          />
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { isPaidUser } from "@/helpers/stripe";
import { parseCookies } from "nookies";
import SubtitleInput from "@/components/TextInput";
import UploadButton from "@/components/upload-button";
import { handleUpload } from "@/helpers/upload";

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

    // Get the video_id and transcribeData from the query
    const { video_id, download_transcript, upload_transcript } = context.query;

    // Get the video url
    const parsedCookies = parseCookies(context);
    const video_url_response = await fetch(
      "https://www.shortzoo.com/api/get-video",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folder: "main",
          id_token: parsedCookies["session"],
          video_id: video_id,
        }),
      }
    );

    const video_url = await (await video_url_response.json()).url;

    if (!video_id || !video_url || !download_transcript || !upload_transcript) {
      return {
        redirect: {
          destination: "/upload-video",
          permanent: false,
        },
      };
    }

    return {
      props: {
        uid: token.uid,
        video_url,
        video_id,
        download_transcript,
        upload_transcript,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
