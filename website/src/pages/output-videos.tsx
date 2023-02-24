import BackButton from "@/components/back-button";
import VideoList from "@/components/video-list";
import React from "react";

export default function VideosPage({ uid }: { uid: string }) {
  return (
    <>
      <BackButton />
      <VideoList uid={uid} />
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getIdToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { isPaidUser } from "@/helpers/stripe";

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

    if (!isPaidUser({ token })) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    const user = await getUser({ uid: token.uid });

    return {
      props: { user: JSON.parse(JSON.stringify(user)), uid: token.uid },
    };
  } catch (error) {
    return handleError(error);
  }
}
