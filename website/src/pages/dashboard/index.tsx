import { useAuth } from "@/configs/firebase/AuthContext";
import React from "react";
import usePremiumStatus from "@/configs/stripe/usePremiumStatus";
import { createCheckoutSession } from "@/configs/stripe/createCheckoutSession";
import Head from "next/head";
import TextButton from "@/components/TextButton";
import router from "next/router";

export default function DashboardPage() {
  const { user } = useAuth();

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
              router.push("/dashboard/output-videos");
            }}
            hover="hover:bg-teal-600 transition-textcolor"
          />
        </div>
      </div>
    </>
  );
}
