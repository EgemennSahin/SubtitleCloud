import React from "react";
import TextButton from "@/components/text-button";
import router from "next/router";
import Seo from "@/components/seo";

export default function DashboardPage({ ...props }) {
  return (
    <>
      <Seo
        title="Videos"
        description="Access your generated videos on our short video subtitling solution."
      />

      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-5 sm:py-9">
        <h1 className="text-style-title"> Videos</h1>

        <div className="flex flex-col gap-4 sm:flex-row">
          <VideoList uid={props.uid} />
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { isPaidUser } from "@/helpers/stripe";
import VideoList from "@/components/video-list";

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

    return {
      props: {
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
