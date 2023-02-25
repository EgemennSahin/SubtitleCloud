import React, { useState } from "react";
import TextButton from "@/components/text-button";
import Head from "next/head";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { createCheckoutSession, isPaidUser } from "@/helpers/stripe";
import getStripe from "@/config/stripe";
import Image from "next/image";

export default function PremiumPage({ user, uid }: { user: any; uid: string }) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("premium");

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  const toggle = () => {
    setIsAnnual(!isAnnual);
  };

  const handleCheckout = async () => {
    try {
      const sessionId = await createCheckoutSession(
        uid,
        selectedPlan,
        isAnnual
      );

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });

      await refreshUserToken();
    } catch (error) {}
  };

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

          <div
            className="ml-8 mb-4 flex w-3/4 items-center justify-start space-x-2"
            onClick={toggle}
          >
            <p
              className={`text-md font-medium  ${
                isAnnual ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Monthly
            </p>
            <div
              className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full bg-slate-400 transition-colors duration-200 ease-in ${
                isAnnual ? "bg-slate-600" : ""
              }`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`mx-1 inline-block h-5 w-5 transform self-center rounded-full bg-slate-100 shadow ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? "translate-x-5 bg-slate-100" : ""
                }`}
              />
            </div>
            <p
              className={`text-md font-medium  ${
                isAnnual ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Annual <span className="font-bold text-teal-500">(20% off!)</span>
            </p>
          </div>
          <div className="flex w-3/4 flex-row justify-between gap-2">
            <div
              onClick={() => handleSelectPlan("premium")}
              className={
                "flex w-1/2 cursor-pointer rounded-xl bg-gradient-to-br from-slate-300 via-slate-400 to-blue-400 p-1 opacity-80 shadow-2xl duration-150 hover:opacity-100 " +
                (selectedPlan == "premium" ? "opacity-100" : "opacity-80")
              }
            >
              <div className="relative flex w-full flex-col rounded-lg bg-slate-100 px-8 pt-4 pb-6 ">
                {selectedPlan === "premium" && (
                  <div className="absolute top-2 left-2 drop-shadow-lg">
                    <CheckCircleIcon className="h-16 w-16 text-teal-500 " />
                  </div>
                )}
                <h2 className=" bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-center text-3xl font-semibold tracking-tight text-transparent">
                  Premium
                </h2>

                <h3 className="mt-3 text-center text-xl font-bold text-slate-600">
                  {isAnnual ? "47.99/year" : "4.99/month"}
                </h3>
                <div className="mx-auto mt-4 space-y-3 text-2xl md:text-lg">
                  <p className="text-slate-700">20 Videos per month</p>
                  <p className="text-slate-700">
                    Video duration up to 3 minutes
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-700">Automatically publish to</p>
                    <Image
                      src="/logos/youtube.svg"
                      alt="Youtube"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                    <Image
                      src="/logos/instagram.svg"
                      alt="Instagram"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />{" "}
                    <Image
                      src="/logos/tiktok.svg"
                      alt="Tiktok"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => handleSelectPlan("business")}
              className={
                "flex w-1/2 cursor-pointer rounded-xl bg-gradient-to-br from-slate-300 via-slate-400 to-blue-400 p-1 opacity-80 shadow-2xl duration-150 hover:opacity-100 " +
                (selectedPlan == "business" ? "opacity-100" : "opacity-80")
              }
            >
              <div className="relative flex w-full flex-col rounded-lg bg-gradient-to-b from-slate-600 via-slate-800 to-slate-900 pt-4 pb-6">
                {selectedPlan === "business" && (
                  <div className="absolute top-2 left-2 drop-shadow-lg">
                    <CheckCircleIcon className="h-16 w-16 text-teal-500 " />
                  </div>
                )}

                <h2 className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-center text-3xl font-semibold tracking-tight text-transparent">
                  Business
                </h2>
                <h3 className="mt-3 text-center text-xl font-bold text-slate-200">
                  Customizable
                </h3>
                <div className="mx-auto mt-4 space-y-3 text-2xl md:text-lg">
                  <p className="text-slate-200">
                    As low as 10 videos per dollar
                  </p>
                  <p className="text-slate-200">No limit on video duration</p>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-200">Automatically publish to</p>
                    <Image
                      src="/logos/youtube.svg"
                      alt="Youtube"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                    <Image
                      src="/logos/instagram.svg"
                      alt="Instagram"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />{" "}
                    <Image
                      src="/logos/tiktok.svg"
                      alt="Tiktok"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TextButton
            size="medium"
            text={selectedPlan == "premium" ? "Checkout" : "Customize"}
            style="mt-8"
            onClick={async () => {
              await handleCheckout();
            }}
          />
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getIdToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { refreshToken } from "firebase-admin/app";
import { refreshUserToken } from "@/helpers/auth";

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
