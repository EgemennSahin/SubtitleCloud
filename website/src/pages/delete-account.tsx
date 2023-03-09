import { deleteUser } from "firebase/auth";
import React, { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import BottomNavigation from "@/components/bottom-navigation";
import { useRouter } from "next/router";
import Sidebar from "@/components/side-bar";
import { auth, db } from "@/config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { authGoogle, logIn } from "@/helpers/auth";
import Link from "next/link";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export default function OnboardingPage() {
  const [password, setPassword] = useState("");

  const router = useRouter();
  async function handleDeleteAccount() {
    const user = auth.currentUser;
    console.log("User:", user);
    if (!user || !user.email) {
      return;
    }

    // re-authenticate
    if (!password) {
      await authGoogle();
    } else {
      await logIn(user.email, password);
    }

    // delete the document
    await deleteDoc(doc(db, "users", user.uid));
    console.log("Hi");
    await deleteUser(user);
    router.push("/");
  }

  return (
    <>
      <Seo
        title="Delete Account"
        description="Verify your email to gain access to generate subtitles for your videos."
      />
      <div className="flex overflow-hidden rounded-lg bg-white">
        <Sidebar />
        <BottomNavigation />
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6 pb-24">
              <div className="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Delete account
                </h1>

                <h2 className="text-md text-slate-600">
                  Are you sure you want to delete your account? This action is
                  irreversible. <br /> If you want to delete your account,
                  please enter your password below. <br />
                  If you are authenticated with Google, you can delete your
                  account without entering your password.
                </h2>

                <div className="my-5 flex flex-col items-center justify-center">
                  <form className="space-y-6">
                    <div className="space-y-1">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-neutral-600"
                      >
                        Password
                      </label>

                      <div className="mt-1">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          placeholder="Your Password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          className="block w-full transform rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                        />
                      </div>
                    </div>
                  </form>

                  <button
                    className="mt-4 block transform items-center rounded-xl border-2 border-red-600 px-10 py-3 text-center text-base font-medium text-red-600 transition duration-500 ease-in-out hover:border-red-700 hover:bg-red-700 hover:text-red-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleDeleteAccount}
                  >
                    Delete account
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

    return {
      props: {},
    };
  } catch (error) {
    return handleError(error);
  }
}
