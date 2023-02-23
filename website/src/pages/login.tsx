import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/configs/firebase/AuthContext";
import Link from "next/link";
import TextButton from "@/components/TextButton";
import Head from "next/head";

export default function LogInPage() {
  const { logIn, authGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await logIn(email, password);

      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authGoogle();

      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
  };

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
                <p className="text-lg font-bold tracking-wide text-teal-500 transition-textcolor hover:text-teal-600">
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

          <div className="flex flex-col gap-5">
            <TextButton
              color="bg-blue-400"
              hover="hover:bg-blue-500"
              size="small"
              text="Continue"
              onClick={handleSignIn}
            />
            <TextButton
              color="bg-red-400"
              hover="hover:bg-red-500"
              size="small"
              text="Sign in with Google"
              onClick={handleGoogleSignIn}
            />
          </div>
        </div>
      </div>
    </>
  );
}
