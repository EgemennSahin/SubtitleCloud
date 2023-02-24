import React from "react";
import Head from "next/head";
import TextButton from "@/components/text-button";
import router from "next/router";

export default function DashboardPage({ ...props }) {
  const { user } = props;

  console.log(user);
  return (
    <>
      <Head>
        <title>Dashboard - Shortzoo</title>
        <meta
          name="description"
          content="Access your generated videos on our short video subtitling solution. Generate subtitles for your videos in a few minutes."
        />
      </Head>

      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-5 sm:py-9">
        <h1 className="mb-3 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text pr-1 text-center text-6xl font-bold leading-tight tracking-tighter text-transparent ">
          Dashboard
        </h1>

        <div className="flex gap-4">
          <TextButton
            size="medium"
            text="Subtitle"
            onClick={() => {
              router.push("/");
            }}
            hover="hover:bg-teal-600 transition-textcolor"
          />
          <TextButton
            size="medium"
            color="bg-teal-500"
            text="Videos"
            onClick={() => {
              router.push("/output-videos");
            }}
            hover="hover:bg-teal-600 transition-textcolor"
          />
        </div>
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
    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const user = await getUser({ uid: token.uid });

    return {
      props: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    return handleError(error);
  }
}
