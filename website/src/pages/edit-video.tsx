import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Seo from "@/components/seo";
import { VideoPlayer } from "@/components/video/video-player";

export default function EditVideoPage({
  uid,
  video_url,
  video_id,
  srt,
  upload_transcript,
  secondaryVideos,
}: {
  uid: string;
  video_url: string;
  video_id: string;
  srt: string;
  upload_transcript: string;
  secondaryVideos: { title: string; video_id: string; url: string }[];
}) {
  const router = useRouter();
  const [secondaryVideo, setSecondaryVideo] = useState<any>(null);
  const [subtitle, setSubtitle] = useState(srt);
  const [currentTime, setCurrentTime] = useState(0);

  // upload the edited srtContent to the uploadUrl
  async function handleUploadSubtitle() {
    // Create a new Blob object from the srtContent string
    const file = new File([srt], uid, { type: "text/plain" });

    // Create a new FormData object and append the Blob to it
    const formData = new FormData();
    formData.append("subtitle", file, uid);
    try {
      await fetch(upload_transcript, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
        },
        body: file,
      });
    } catch (error) {
      console.error(error);
    }
  }

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
            <div className="py-6 pb-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Edit video
                </h1>

                <div className="mx-auto mb-8 w-1/2 text-slate-700">
                  <p>Follow these steps to enhance your video:</p>
                  <ol>
                    <li>
                      <span className="text-slate-600">1.</span> Edit the text
                      and timing of your subtitles by clicking on the subtitle
                      you want to edit and making the changes you need. You can
                      edit up to 15 subtitles at a time.
                    </li>
                    <li>
                      <span className="text-slate-600">2.</span> Choose your
                      bottom video (optional) by clicking on the "Choose an
                      option" button and selecting the video you want to add.
                    </li>
                    <li>
                      <span className="text-slate-600">3.</span> Process your
                      video by clicking on the "Continue" button.
                    </li>
                  </ol>
                </div>

                <div className="mb-8 flex flex-col items-center justify-start">
                  <h3 className="mb-2 text-xl font-semibold">Main Video</h3>
                  <p className="w-1/2 text-center text-sm text-slate-500">
                    The subtitle overlay may not be accurate due to your
                    browser. This is only a preview.
                  </p>

                  <VideoPlayer
                    src={video_url}
                    size="medium"
                    hideControls
                    subtitles={subtitle}
                    setTime={setCurrentTime}
                  />
                </div>
                <div className="mb-8 flex flex-col items-center">
                  <h3 className="mb-3 text-xl font-semibold">Subtitles</h3>
                  <SubtitleEditor
                    srt={subtitle}
                    setSrt={setSubtitle}
                    time={currentTime}
                  />
                </div>

                <div className="flex h-full flex-col items-center justify-start gap-2">
                  <h3 className="text-xl font-semibold">Bottom Video</h3>

                  {secondaryVideo && (
                    <VideoPlayer
                      src={secondaryVideo.url}
                      size="small"
                      hideControls
                    />
                  )}

                  <div className="flex items-center gap-2">
                    <Dropdown
                      options={secondaryVideos.map((video) => ({
                        id: video.video_id!,
                        label: video.title!,
                        other: video.url,
                      }))}
                      onChange={(option) => {
                        setSecondaryVideo({
                          video_id: option.id,
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
                          video_id: side_video_id,
                          url: side_video_url,
                        });
                      }}
                      disabled={false}
                    />
                  </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                  <div className="py-4">
                    <div className="items-bottom mt-6 flex justify-center">
                      <button
                        onClick={async () => {
                          // Upload the edited subtitle
                          await handleUploadSubtitle();

                          // Redirect to the video page
                          router.push({
                            pathname: "/add-to-video",
                            query: {
                              video_id: video_id,
                              side_video_id: secondaryVideo?.video_id || null,
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
import { parseCookies } from "nookies";
import SubtitleInput from "@/components/subtitle/subtitle-editor";
import UploadButton from "@/components/upload-button";
import { handleUpload } from "@/helpers/upload";
import Sidebar from "@/components/navigation/side-bar";
import BottomNavigation from "@/components/navigation/bottom-bar";
import Dropdown from "@/components/dropdown-menu";
import videos from "./videos";
import { premiumStorage } from "@/config/firebase";
import { getVideos } from "@/helpers/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import SubtitleEditor from "@/components/subtitle/subtitle-editor";

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

    // Download the transcript
    const transcript_response = await fetch(download_transcript as string);

    const transcript = await transcript_response.text();

    // Get videos
    const secondaryVideos = await getVideos({
      uid: token.uid,
      folder: "secondary",
    });

    const defaultSecondaryVideos = await getVideos({
      uid: "default",
      folder: "secondary",
    });

    // Combine secondaryVideos and defaultSecondaryVideos
    secondaryVideos.videoData = [
      ...secondaryVideos.videoData,
      ...defaultSecondaryVideos.videoData,
    ];

    return {
      props: {
        uid: token.uid,
        video_url,
        video_id,
        srt: transcript,
        upload_transcript,
        secondaryVideos: secondaryVideos.videoData,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
