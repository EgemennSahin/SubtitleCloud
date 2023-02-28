import React from "react";
import Head from "next/head";
import { isPaidUser } from "@/helpers/stripe";

export default function PremiumPage({ uid }: { uid: string }) {
  return (
    <>
      <Head>
        <title>Choose Plan - Shortzoo</title>
        <meta
          name="description"
          content="Choose a subscription plan to gain access to generate subtitles for your videos."
        />
      </Head>
      <div className="relative grow bg-gradient-to-b from-slate-50 to-slate-200 px-6 py-5 sm:py-9 md:px-8 lg:px-20">
        <h1 className="text-style-title">Check out</h1>

        <h3 className="text-style-subheader">
          Save <span className="text-teal-500">25%</span> by paying annually.{" "}
        </h3>

        <div className="flex flex-col items-center">
          <PricingPlans uid={uid} />
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import PricingPlans from "@/components/pricing-plans";

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
