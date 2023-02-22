import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/configs/firebase/AuthContext";
import Link from "next/link";
import TextButton from "@/components/TextButton";

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
    <div className="mx-auto mt-8 max-w-2xl flex-col rounded-lg bg-white px-16 py-14 drop-shadow-2xl">
      <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
        Log in to your Shortzoo account
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
            <p className="text-lg font-bold tracking-wide text-blue-600 hover:text-blue-500">
              Forgot Password?
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
        <TextButton size="small" text="Continue" onClick={handleSignIn} />
        <TextButton
          color="bg-red-400"
          size="small"
          text="Sign in with Google"
          onClick={handleGoogleSignIn}
        />
      </div>
    </div>
  );
}
