import React from "react";
import Head from "next/head";
import TextButton from "@/components/text-button";
import router from "next/router";

export default function DashboardPage({ ...props }) {
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
        <h1 className="text-style-title"> Dashboard</h1>

        <div className="flex flex-col gap-4 sm:flex-row">
          <TextButton
            size="medium"
            text="Subtitle"
            onClick={() => {
              router.push("/process-video");
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
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { isPaidUser } from "@/helpers/stripe";
import { auth } from "@/config/firebase";

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

    const user = await getUser({ uid: token.uid });

    return {
      props: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    return handleError(error);
  }
}
