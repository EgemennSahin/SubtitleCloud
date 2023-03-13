import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Seo from "@/components/seo";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { parseCookies } from "nookies";
import UploadButton from "@/components/upload-button";
import { handleUpload } from "@/helpers/upload";
import Dropdown from "@/components/dropdown-menu";
import { premiumStorage } from "@/config/firebase";
import { getVideos } from "@/helpers/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import SubtitleEditor from "@/components/subtitle/subtitle-editor";
import Instructions from "@/components/instructions";
import { DashboardPage } from "@/components/navigation/dashboard-page";
import VideoPlayer from "@/components/video/video-player";

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
  const [secondaryVideo, setSecondaryVideo] = useState<{
    video_id: string;
    url: string;
  }>();
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

  const instructions = [
    "Choose your bottom video from your extras (optional)",
    "Adjust the text and timing of your subtitles.",
  ];

  // Formatting the subtitles to VTT format to be displayed on the video player
  const [formattedSubtitles, setFormattedSubtitles] = useState(srt);
  useEffect(() => {
    let vttSubtitles =
      "WEBVTT\n" + subtitle?.replaceAll(",", ".").replaceAll(/\n{2,}/g, "\n");

    let lines = vttSubtitles.split("\n");

    for (let i = 0; i < lines.length; i++) {
      if (i % 3 == 2) {
        lines[i] = lines[i] + " line:50% position:50% align:center size:100%";
      }
    }

    setFormattedSubtitles(lines.join("\n"));
  }, [subtitle]);

  return (
    <>
      <Seo
        title="Edit Subtitles"
        description="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
      />

      <DashboardPage
        title="Edit video"
        subtitle={
          <Instructions title="Instructions" instructions={instructions} />
        }
      >
        <section className="col-span-2 lg:col-span-1">
          <h3 className="text-id">Main video</h3>

          <VideoPlayer
            src={video_url}
            subtitles={formattedSubtitles}
            setTime={setCurrentTime}
          />
        </section>

        <section className="col-span-2 flex flex-col items-center gap-3 lg:col-span-1">
          <h3 className="text-id">Bottom video</h3>

          <div className="flex gap-2">
            <Dropdown
              options={secondaryVideos.map((video) => ({
                id: video.video_id!,
                label: video.title!,
                other: video.url,
              }))}
              onChange={(option) => {
                console.log("New option: ", option);
                setSecondaryVideo({
                  video_id: option.id,
                  url: option.other,
                });
              }}
            />

            <UploadButton
              size="medium"
              setFile={async (file: Blob) => {
                const side_video_id = await handleUpload(file, "secondary");

                // Get the download URL
                const side_video_url = await getDownloadURL(
                  ref(premiumStorage, `secondary/${uid}/${side_video_id}`)
                );

                setSecondaryVideo({
                  video_id: side_video_id,
                  url: side_video_url,
                });
              }}
            />
          </div>

          {secondaryVideo?.url && (
            <VideoPlayer
              key={secondaryVideo.video_id}
              src={secondaryVideo.url}
            />
          )}
        </section>

        <div className="col-span-2 flex flex-col items-center">
          <h3 className="text-id">Subtitle editor</h3>
          <SubtitleEditor
            srt={subtitle}
            setSrt={setSubtitle}
            time={currentTime}
          />
        </div>

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
          className="btn-primary col-span-2 mt-8"
        >
          Continue
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

    const uid = token.uid;

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
    const srt = await (await fetch(download_transcript as string)).text();

    // Get videos
    const userVideos = await getVideos({
      uid: uid,
      folder: "secondary",
    });

    const defaultVideos = await getVideos({
      uid: "default",
      folder: "secondary",
    });

    // Combine secondaryVideos and defaultSecondaryVideos
    const secondaryVideos = [
      ...userVideos.videoData,
      ...defaultVideos.videoData,
    ];

    return {
      props: {
        uid: uid,
        video_url,
        video_id,
        srt,
        upload_transcript,
        secondaryVideos,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
