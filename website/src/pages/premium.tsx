import React, { useState } from "react";
import TextButton from "@/components/text-button";
import Head from "next/head";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { handleCheckout, isPaidUser } from "@/helpers/stripe";
import Image from "next/image";

export default function PremiumPage({ user, uid }: { user: any; uid: string }) {
  return (
    <>
      <Head>
        <title>Choose Plan - Shortzoo</title>
        <meta
          name="description"
          content="Choose a subscription plan to gain access to generate subtitles for your videos."
        />
      </Head>
      <div className="my-8 w-3/4 self-center rounded-lg bg-slate-50 px-8 py-14 drop-shadow-xl">
        <div className="flex flex-col items-center drop-shadow">
          <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
            Choose your plan
          </h2>

          <PricingPlans uid={uid} />
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getIdToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import PricingPlans from "@/components/pricing-plans";

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
