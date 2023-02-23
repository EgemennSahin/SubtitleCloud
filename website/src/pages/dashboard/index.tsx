import { useAuth } from "@/configs/firebase/AuthContext";
import Link from "next/link";
import React from "react";
import usePremiumStatus from "@/configs/stripe/usePremiumStatus";
import { createCheckoutSession } from "@/configs/stripe/createCheckoutSession";
import Head from "next/head";
import TextButton from "@/components/TextButton";
import router from "next/router";

export default function DashboardPage() {
  const { user } = useAuth();
  const userIsPremium = usePremiumStatus(user);

  return (
    <>
      <Head>
        <title>Dashboard - Shortzoo</title>
        <meta
          name="description"
          content="Access your generated videos on our short video subtitling solution. Generate subtitles for your videos in a few minutes."
        />
      </Head>

      <div className="flex h-screen flex-col items-center">
        <div>
          {user && (
            <div className="flex flex-col items-center">
              Hello, {user.displayName}
              {userIsPremium == null ? (
                <div>Loading...</div>
              ) : !userIsPremium ? (
                <button
                  className="rounded-lg bg-blue-600 py-4 px-8 text-white"
                  onClick={() => createCheckoutSession(user.uid)}
                >
                  Upgrade to Premium
                </button>
              ) : (
                <div>You are a premium user</div>
              )}
            </div>
          )}
        </div>

        <div className="flex">
          <TextButton
            size="medium"
            text="Subtitle"
            onClick={() => {
              router.push("/dashboard/output-videos");
            }}
            hover="hover:bg-teal-600 transition duration-200"
          />
          <TextButton
            size="medium"
            color="bg-teal-500"
            text="Videos"
            onClick={() => {
              router.push("/dashboard/output-videos");
            }}
            hover="hover:bg-teal-600 transition duration-200"
          />
        </div>
      </div>
    </>
  );
}
