import React, { useEffect, useState } from "react";
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
  const [secondaryVideo, setSecondaryVideo] = useState<any>(null);

  const [videos, setVideos] = useState<
    { title: string | undefined; uid: string | undefined; url: string }[]
  >([]);

  const storageRef = ref(premiumStorage, `secondary/${uid}`);

  useEffect(() => {
    getVideos(storageRef).then((videoUrls) => {
      setVideos(videoUrls);
    });
  }, [uid, storageRef]);

  return (
    <>
      <Seo
        title="Edit Subtitles"
        description="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
      />

      <div className="flex overflow-hidden rounded-lg bg-white">
        <Sidebar />
        <BottomNavigation />

        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Edit video
                </h1>

                <div className="grid grid-cols-2 items-center">
                  <div className="flex flex-col items-center justify-center">
                    <VideoPlayer src={video_url} size="medium" hideControls />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <h3>Secondary Video</h3>

                    {secondaryVideo && (
                      <VideoPlayer
                        src={secondaryVideo.url}
                        size="small"
                        hideControls
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <Dropdown
                        options={videos.map((video) => ({
                          id: video.uid!,
                          label: video.title!,
                          other: video.url,
                        }))}
                        onChange={(option) => {
                          setSecondaryVideo({
                            uid: option.id,
                            url: option.other,
                          });
                        }}
                      />
                      <UploadButton
                        size="small"
                        setFile={async (file: Blob) => {
                          const side_video_id = await handleUpload(
                            file,
                            "secondary"
                          );

                          // Get the download URL
                          const side_video_url = await getDownloadURL(
                            ref(
                              premiumStorage,

                              `secondary/${uid}/${side_video_id}`
                            )
                          );

                          setSecondaryVideo({
                            uid: side_video_id,
                            url: side_video_url,
                          });
                        }}
                        disabled={false}
                      />
                    </div>
                  </div>

                  <div className="flex h-full flex-col items-center justify-start gap-2">
                    <h3>Subtitles</h3>
                    <SubtitleInput
                      downloadUrl={download_transcript}
                      uploadUrl={upload_transcript}
                      uid={uid}
                    />
                  </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                  <div className="py-4">
                    <div className="items-bottom mt-6 flex justify-center">
                      <button
                        onClick={async () => {
                          // Upload the secondary video

                          // Redirect to the video page
                          router.push({
                            pathname: "/add-to-video",
                            query: {
                              video_id: video_id,
                              side_video_id: secondaryVideo.uid,
                            },
                          });
                        }}
                        className="btn-primary"
                      >
                        Continue
                      </button>
                    </div>
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
import { parseCookies } from "nookies";
import SubtitleInput from "@/components/TextInput";
import UploadButton from "@/components/upload-button";
import { handleUpload } from "@/helpers/upload";
import Sidebar from "@/components/side-bar";
import BottomNavigation from "@/components/bottom-navigation";
import Dropdown from "@/components/dropdown-menu";
import videos from "./videos";
import { premiumStorage } from "@/config/firebase";
import { getVideos } from "@/helpers/firebase";
import { getDownloadURL, ref } from "firebase/storage";

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
          destination: "/pricing",
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
