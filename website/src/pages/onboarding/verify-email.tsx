import { sendEmailVerification, User } from "firebase/auth";
import React from "react";
import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import BottomNavigation from "@/components/navigation/bottom-bar";
import Navbar from "@/components/navigation/nav-bar";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { auth } from "@/config/firebase";
import Sidebar from "@/components/navigation/side-bar";
import { dashboardRoute } from "@/helpers/routing";

export default function VerifyEmail({ token }: { token: DecodedIdToken }) {
  async function handleVerifyEmail() {
    const user = auth.currentUser;

    if (!token || !user) {
      return;
    }

    await sendEmailVerification(user);
  }

  return (
    <>
      <Seo
        title="Verify Email"
        description="Verify your email to gain access to generate subtitles for your videos."
      />
      <div className="flex overflow-hidden rounded-lg bg-white">
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6 pb-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Verify email
                </h1>
                <div className="my-5 flex flex-col items-center justify-center">
                  <h3 className="text-md mb-4 text-slate-600">
                    Click the button to verify{" "}
                    {token?.email && (
                      <span className="font-semibold">{token.email}</span>
                    )}
                    .
                  </h3>
                  <button className="btn-primary" onClick={handleVerifyEmail}>
                    Send verification email
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

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

    const authorized = dashboardRoute(token);
    if (!(authorized == true)) {
      return {
        redirect: {
          destination: authorized,
          permanent: false,
        },
      };
    }
    return {
      props: {
        token: token,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}