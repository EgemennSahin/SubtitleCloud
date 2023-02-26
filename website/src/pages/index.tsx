import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import TextButton from "@/components/text-button";
import { useRouter } from "next/router";
import Head from "next/head";

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Shortzoo</title>
        <meta
          name="description"
          content="Shortzoo is a short video subtitling platform that subtitles each word in your videos. Our platform is perfect for making your videos more engaging."
        />
      </Head>
      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-5 sm:py-9">
        <h1 className="text-style-title">Caption Video</h1>
        <h2 className="text-style-subtitle">
          Enhance your short video with accurate subtitles
        </h2>

        <div className="items-center justify-center p-4">
          <TextButton
            size="large"
            onClick={() => router.push("/process-video")}
            text={"Start now"}
          />
        </div>

        <ul className="mt-8 grid grid-cols-1 grid-rows-2 justify-center gap-3 sm:grid-cols-2 sm:gap-7 md:gap-x-12">
          <li className="flex items-center space-x-1">
            <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />
            <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
              Caption word by word
            </h3>
          </li>

          <li className="flex items-center space-x-1">
            <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />

            <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
              Increase engagement
            </h3>
          </li>
        </ul>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getIdToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getIdToken({ context });

    const user = await getUser({ uid: token?.uid });

    return {
      props: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    return handleError(error);
  }
}
