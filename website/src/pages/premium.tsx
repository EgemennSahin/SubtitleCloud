import React from "react";
import Head from "next/head";
import { isPaidUser } from "@/helpers/stripe";

export default function PremiumPage({ uid }: { uid: string }) {
  return (
    <>
      <Seo
        title="Choose Plan"
        description="Choose a subscription plan to gain access to generate subtitles for your videos."
      />
      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-5 sm:py-9">
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
import Seo from "@/components/seo";

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

    return {
      props: {
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
