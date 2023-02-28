import React from "react";
import { ArrowUpCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import TextButton from "@/components/text-button";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

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
      <div className="grow bg-gradient-to-b from-slate-50 to-slate-200">
        <div className="grid grid-cols-1 gap-12 px-3 pt-1 lg:grid-cols-2 lg:gap-4 lg:px-16 lg:pt-8">
          <div className=" flex flex-col justify-start">
            <h1 className="text-style-title text-center lg:text-left">
              Caption Video
            </h1>
            <h2 className="text-style-subtitle text-center lg:text-left">
              Enhance your short video with accurate subtitles
              <br />
              for each word
            </h2>

            <div className="flex items-center justify-center p-4">
              <TextButton
                size="medium"
                onClick={() => router.push("/process-video")}
                text={"Get started"}
              />
            </div>

            <ul className="mt-5 grid w-fit grid-cols-4 gap-4 self-center lg:grid-cols-2 lg:gap-7 lg:gap-x-12">
              <li className="flex shrink items-center space-x-1">
                <ArrowUpCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />

                <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
                  Watch time
                </h3>
              </li>

              <li className="flex items-center space-x-1">
                <ArrowUpCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />

                <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
                  Engagement
                </h3>
              </li>

              <li className="flex items-center space-x-1">
                <ArrowUpCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />

                <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
                  Accessibility
                </h3>
              </li>

              <li className="flex items-center space-x-1">
                <ArrowUpCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />

                <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
                  Quality
                </h3>
              </li>
            </ul>
          </div>
          <div className="mb-6 flex flex-col items-center justify-start">
            <Image
              src="/images/landing-page.svg"
              width={500}
              height={500}
              alt={"Landing page image"}
            />
          </div>
        </div>
        <h3 className="text-style-subheader mt-10 text-center">
          &quot;Captioning manually is like solving a puzzle in the dark - you
          know what it should look like, but can&apos;t see the pieces&quot;
        </h3>
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
