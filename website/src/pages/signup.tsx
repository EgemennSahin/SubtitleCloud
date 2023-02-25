import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import TextButton from "@/components/text-button";
import Head from "next/head";
import { signUp, authGoogle } from "@/helpers/auth";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);

  function isValidEmail(email: string) {
    // Regular expression to validate email addresses
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (regex.test(email)) {
      setValidEmail(true);
      return true;
    } else {
      setValidEmail(false);
      setEmail("");
      return false;
    }
  }

  function isValidPassword(password: string) {
    // Regular expression to validate email password
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    if (regex.test(password)) {
      setShowPasswordMessage(false);
      return true;
    } else {
      setShowPasswordMessage(true);
      setPassword("");
      return false;
    }
  }

  function checkRegex() {
    const validEmail = isValidEmail(email);
    const validPassword = isValidPassword(password);

    return validEmail && validPassword;
  }

  return (
    <>
      <Head>
        <title>Sign Up - Shortzoo</title>
        <meta
          name="description"
          content="Sign up for our short video subtitling solution and start adding subtitles to your videos in minutes. Increase your reach and engagement with subtitles."
        />
      </Head>
      <div className="my-8 flex max-w-xl grow flex-col self-center rounded-lg bg-slate-50 px-16 py-14 drop-shadow-xl sm:grow-0">
        <div className="drop-shadow">
          <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
            <span className="hidden sm:block">
              Create your Shortzoo account
            </span>
            <span className="sm:hidden">Create account</span>
          </h2>
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
              {!validEmail && (
                <p
                  className="absolute top-full left-0 mt-1 text-red-400"
                  style={{ zIndex: 1 }}
                >
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div
              className="mb-8 flex flex-col"
              style={{ position: "relative" }}
            >
              <div className="flex">
                <label className="text-lg font-bold tracking-wide text-slate-600">
                  Password
                </label>
              </div>

              <input
                type="password"
                className="rounded-md border-2 border-slate-700 bg-white p-2.5 text-black shadow-inner"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordMessage(true)}
                onBlur={() => setShowPasswordMessage(false)}
              />

              {showPasswordMessage && (
                <p
                  className="absolute top-full place-self-end rounded-md bg-slate-100 bg-opacity-95 p-4 text-sm text-slate-500 drop-shadow-xl"
                  style={{ zIndex: 1 }}
                >
                  Password must contain at least:
                  <ul>
                    <li className="font-bold">8 characters</li>
                    <li className="font-bold">1 uppercase letter</li>
                    <li className="font-bold">1 lowercase letter</li>
                    <li className="font-bold">1 number</li>
                  </ul>
                </p>
              )}
            </div>
            <TextButton
              color="bg-blue-400"
              hover="hover:bg-blue-500"
              size="small"
              text="Sign up"
              onClick={async () => {
                if (!checkRegex()) {
                  return;
                }
                await signUp(email, password);
              }}
            />

            <span className="my-4 text-center text-lg font-bold tracking-wide text-slate-600">
              or
            </span>

            <TextButton
              color="bg-red-400"
              hover="hover:bg-red-500"
              size="small"
              text="Sign up with Google"
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
