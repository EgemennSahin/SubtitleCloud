import React from "react";
import Head from "next/head";
import { isPaidUser } from "@/helpers/stripe";

export default function VerifyCheckoutPage() {
  return (
    <>
      <Head>
        <title>Verify Payment - Shortzoo</title>
        <meta
          name="description"
          content="Choose a subscription plan to gain access to generate subtitles for your videos."
        />
      </Head>
      <div className="flex grow flex-col items-center bg-gradient-to-b from-slate-200 to-slate-400 px-6 py-5 sm:py-9 md:px-8 lg:px-20">
        <h1 className="text-style-title">Verifying</h1>
        <h2 className="text-style-subtitle">
          Please wait while we verify your payment...
        </h2>

        <div className="loader mt-16 h-56 w-56" />
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getIdToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { refreshIdToken } from "@/helpers/auth";

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

    if (isPaidUser({ token })) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    const user = await getUser({ uid: token.uid });

    // Check if user has already verified their payment
    await refreshIdToken();

    return {
      props: {
        uid: token.uid,
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
