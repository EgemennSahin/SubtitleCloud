import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import TextButton from "@/components/text-button";
import Head from "next/head";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  function handlePasswordReset(e: FormEvent) {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Check your email to reset password");
      })
      .catch((error: any) => {
        console.log(error);
        setError("E-mail not found");
      });
  }

  return (
    <>
      <Head>
        <title>Reset Password - Shortzoo</title>
        <meta
          name="description"
          content="Reset your password and regain access to your account on our short video subtitling solution."
        />
      </Head>
      <div className="my-8 flex max-w-xl grow flex-col self-center rounded-lg bg-slate-50 px-16 py-14 drop-shadow-xl sm:grow-0">
        <div className="drop-shadow">
          <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
            <span className="hidden sm:block">
              Reset your Shortzoo password
            </span>
            <span className="sm:hidden">Reset password</span>
          </h2>
          <h3 className="mb-4 hidden text-slate-600 sm:block">
            Enter the email associated with your account and you will receive a
            link to reset your password.
          </h3>
          <div className="flex flex-col">
            <div
              className="mb-8 flex flex-col"
              style={{ position: "relative" }}
            >
              <label className="text-lg font-bold tracking-wide text-slate-600">
                Email
              </label>
              <input
                type="email"
                className="rounded-md border-2 border-slate-700 bg-white p-2.5 text-black shadow-inner"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <TextButton
              size="small"
              text="Continue"
              color="bg-blue-400"
              hover="hover:bg-blue-500"
              onClick={() => handlePasswordReset}
            />
            <Link href="/login" passHref>
              <p className="transition-textcolor mt-5 text-center text-lg font-bold tracking-wide text-teal-500 hover:text-teal-600">
                Return to sign in
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getToken({ context });

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
