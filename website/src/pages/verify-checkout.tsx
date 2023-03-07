import React, { useEffect } from "react";
import Head from "next/head";
import { isPaidUser } from "@/helpers/stripe";
import { auth } from "@/config/firebase";
import { useRouter } from "next/router";

export default function VerifyCheckoutPage() {
  const router = useRouter();

  // Refresh the token
  useEffect(() => {
    async function verify() {
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      await user.getIdToken(true);
      router.push("/dashboard");
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        verify();
      }
    });

    return () => unsubscribe();
  });

  return (
    <>
      <Seo
        title="Verify Payment"
        description="Choose a subscription plan to gain access to generate subtitles for your videos."
      />
      <Sidebar />
      <BottomNavigation />
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
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import Sidebar from "@/components/side-bar";
import BottomNavigation from "@/components/bottom-navigation";

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
