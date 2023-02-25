import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import TextButton from "@/components/text-button";
import Head from "next/head";
import { authGoogle, logIn } from "@/helpers/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Head>
        <title>Log In - Shortzoo</title>
        <meta
          name="description"
          content="Sign in to our short video subtitling solution and gain access to your account."
        />
      </Head>
      <div className="my-8 flex max-w-xl grow flex-col self-center rounded-lg bg-slate-50 px-16 py-14 drop-shadow-xl sm:grow-0">
        <div className="drop-shadow">
          <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
            <span className="hidden sm:block">
              Log in to your Shortzoo account
            </span>
            <span className="sm:hidden">Log in</span>
          </h2>

          <div className="mb-8 flex flex-col">
            <label className="text-lg font-bold tracking-wide text-slate-600">
              Email
            </label>
            <input
              type="email"
              className="rounded-md border-2 border-slate-700 bg-white p-2.5 text-black shadow-inner"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-8 flex flex-col">
            <div className="flex justify-between">
              <label className="text-lg font-bold tracking-wide text-slate-600">
                Password
              </label>
              <Link href="/password-reset" passHref>
                <p className="transition-textcolor text-lg font-bold tracking-wide text-teal-500 hover:text-teal-600">
                  <span className="hidden sm:block">Forgot password? </span>
                  <span className="sm:hidden">Forgot?</span>
                </p>
              </Link>
            </div>

            <input
              type="password"
              className="rounded-md border-2 border-slate-700 bg-white p-2.5 text-black shadow-inner"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <TextButton
              color="bg-blue-400"
              hover="hover:bg-blue-500"
              size="small"
              text="Continue"
              onClick={async () => await logIn(email, password)}
            />

            <span className="my-4 text-center text-lg font-bold tracking-wide text-slate-600">
              or
            </span>

            <TextButton
              color="bg-red-400"
              hover="hover:bg-red-500"
              size="small"
              text="Sign in with Google"
              onClick={async () => await authGoogle()}
            />
          </div>
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getIdToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getIdToken({ context });

    if (token) {
      return {
        redirect: {
          destination: "/dashboard",
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
