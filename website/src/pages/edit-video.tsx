import UploadButton from "@/components/upload-button";
import React, { useEffect, useState } from "react";
import TextButton from "@/components/text-button";
import { useRouter } from "next/router";
import Seo from "@/components/seo";
import { VideoPlayer } from "@/components/video-player";

export default function EditVideoPage({
  video_url,
  video_id,
  download_transcript,
  upload_transcript,
}: {
  video_url: string;
  video_id: string;
  download_transcript: string;
  upload_transcript: string;
}) {
  const router = useRouter();

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
            <VideoPlayer
              src="https://ff209d4e1f0e870ca470b2ab7570bbc3ff631ee172c21834b006ac5-apidata.googleusercontent.com/download/storage/v1/b/short-zoo-temp-videos/o/created%2F129.170.195.201,35.203.255.114%2F83f63838-f746-406e-9a5d-f0cc19a57a3b?jk=AahUMlv7ToojuM-MpRNhmQhn3ZULYEk5e98JcG36i4qXtrN1wx7u-2AK-xq6A7bbqmb2KYFxnQr8njL5Etl77dzBbrYRNWpS0dTuA0NHeNJtniDeOZsMsae9SmWqP9H58lA-axxxODqaIoQRCvGL89WOwollx9gHVAZltxHh7a1IPWKIheTA9bp5DcrDi69OCTfXicHELiqoamQNi7upjYbKN39xXH4dJWQ7FtxZRJl-6Q6fTfoOviyVrJAgCoE250zVoOjSM1-1Y8jsfJYr0Zg8AmW1tnUTYqzqR10x8x1KMcFAxVbTTZ3lH4MN_VRKjNjOyZEfOnv0ajhGL0f6QJGqym2QcCNhv12h7Qj2Sn40fqFLbbHIOzttN2UXNyHohkvSZjWIWZ09wv-aGfJ14n6-cvTchCdvgWOM7w02A2Q70nsrPSW30TC8ieaCp4znueoibEmUd4w9bGM7N0kuAtluzF8MwsaK7eMukWPybFlqIo1EV_LNDQpsLFCTxh1AE2sQ8-g0Pu-oxn7MAmGMH2KTdGnJx0pPqqhUYNmld-gOd4-9LLtYGbZNXyANzif_UdUUpqHIyuPG0nUU16kQF9j3-e63Mgrc3VDThbx5XoxWa8nxfdFYUrGTJ6RQ3dcN7xwTMRgZ3o-c-pwvJNJ6YPcOUoKQaEIy3rZjFSiwa0xYso7C9HIQDgKTPSe15s9a3rF28xHRcK1zjCdHp4aIsbOAB1b75RBzLwtSDGdWjLgpU1ZyZb3lnKg9t-t4h4mp7-UMqcIsPP51Vb-WM3lZHWi94YnIi1h8_4aa8udDhP2MUzY7qH87jaRwNQWK1zTDzHvWvol-flNgtDndbloLxAbSXmZ-imn6uDyRiujeKSqie8H-DRVE5tKuAHryVf5eFGo4ZDqMPk92gnB7IfGWrl4JWUdZ5juFA0nzgbFCErK2BtT5EJhfVEVz0HRhkmHeO88KoKZ4al_v3xiHB4OOwYe2yFKM8sLWDYZ633oXZ58Ufxh9SRx4KvWcipoeUlAm4EiByNdy1kIdlX71l64t6VfHJ01pSj_ZHwZswN93O7lcDPC6vs67gNHtqfOXdOWlZwLovnyouWEwItNEDAbo0U1mVjrIi-HZ16Arzy76g4vZv6rbH2ekAUixqVjuTYaElZ5vTflvOSvl6eRccrqApcS0-mtJAc4QofS6Y8sF5q1K2EVwLLfNdmfF2DCFxR9picfQQXRskLVB0xNcgnpimH_Ot249ozQz1-uVsAm4qtgAiD3drrs62Fg48rkKF51_rjFC1CjuX6YgYpC-4Smq3sQGdbBXIrpwAw&isca=1"
              size="medium"
            />
          </div>

          <div className="flex h-full flex-col items-center justify-start">
            <h3 className="text-style-subheader">Subtitles</h3>
            <SubtitleInput url={download_transcript} />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <TextButton
            color="primary"
            size="medium"
            onClick={async () => {}}
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
    // const { video_id, download_transcript, upload_transcript } = context.query;
    const video_id = "test";

    console.log("Test1");
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
          id_token: parsedCookies["firebasetoken"],
          video_id: video_id,
        }),
      }
    );

    console.log("Test2");

    // const video_url = await (await video_url_response.json()).url;

    // if (!video_id || !video_url || !download_transcript || !upload_transcript) {
    //   return {
    //     redirect: {
    //       destination: "/upload-video",
    //       permanent: false,
    //     },
    //   };
    // }

    return {
      props: {
        uid: token.uid,
        video_url: "test1",
        video_id: "test2",
        download_transcript: "test3",
        upload_transcript: "test4",
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
