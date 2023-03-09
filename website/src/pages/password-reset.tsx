import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Seo from "@/components/seo";
import Navbar from "@/components/navigation/nav-bar";
import BottomNavigation from "@/components/navigation/bottom-bar";

export default function PasswordResetPage({ uid }: { uid: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);

      // Show modal and redirect to login page

      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Seo
        title="Reset Password"
        description="Reset your password and regain access to your account on our short video subtitling solution."
      />
      {!uid && <Navbar uid={""} />}
      <div className="flex overflow-hidden rounded-lg bg-white">
        {uid && (
          <>
            <Sidebar />
            <BottomNavigation />
          </>
        )}
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6 pb-24">
              <div className="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Reset Password
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-600"
                    >
                      {" "}
                      Email address{" "}
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full transform rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full transform items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Send password reset email
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Sidebar from "@/components/navigation/side-bar";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getToken({ context });

    if (!token) {
      return {
        props: {},
      };
    }
    return {
      props: { uid: token?.uid },
    };
  } catch (error) {
    return handleError(error);
  }
}
