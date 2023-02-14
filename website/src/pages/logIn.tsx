import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/configs/firebase/AuthContext";
import Link from "next/link";

export default function LogInPage() {
  const { logIn, authGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await logIn(email, password);

      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await authGoogle();

      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white max-w-2xl mx-auto p-16 rounded-md drop-shadow-2xl flex-col space-y-4">
      <h2 className="text-4xl text-transparent bg-gradient-to-r bg-clip-text from-slate-700 to-slate-800 font-bold mb-4 tracking-tighter">
        Sign in to your account
      </h2>

      <form onSubmit={handleSignIn}>
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-1">
            <label className="text-slate-600 font-bold text-xl tracking-wider">
              Email
            </label>
            <input
              type="email"
              className="bg-white border-2 border-slate-700 shadow-inner rounded-md text-black p-2.5"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <label className="text-slate-700 font-bold text-lg tracking-wide">
                Password
              </label>
              <Link href="/passwordReset" passHref>
                <p className="text-blue-600 font-bold text-lg tracking-wide">
                  Forgot Password?
                </p>
              </Link>
            </div>

            <input
              type="password"
              className="bg-white border-2 border-slate-700 shadow-inner rounded-md text-black p-2.5"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Continue"
            className="text-white font-bold rounded-md mt-5 py-4 px-20 bg-blue-600 hover:bg-blue-800 transition duration-200"
          />
        </div>
      </form>

      <form onSubmit={handleGoogleSignIn}>
        <input
          type="submit"
          value="Sign in with Google"
          className="text-white font-bold rounded-md mt-5 py-4 px-20 bg-blue-600 hover:bg-blue-800 transition duration-200"
        />
      </form>
    </div>
  );
}
