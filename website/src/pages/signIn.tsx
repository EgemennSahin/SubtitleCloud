import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const { logIn } = useAuth();

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

  function toPasswordReset() {
    router.push("/passwordReset");
  }

  return (
    <div className="w-1/3 mx-auto">
      <h2 className="text-center font-normal mt-32 text-2xl text-teal-800">
        Firebase 9 Authentication <br /> Sign In
      </h2>

      <div className="space-y-3">
        <form onSubmit={handleSignIn}>
          <div className="flex flex-col space-y-3">
            <label className="text-teal-900 font-bold text-lg tracking-wide">
              Email
            </label>
            <input
              type="email"
              placeholder="E-mail"
              className="bg-none border-2 border-teal-900 focus:outline-none rounded-xl font-bold text-teal-700 p-2"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="text-teal-900 font-bold text-lg tracking-wide">
              Password
            </label>

            <input
              type="password"
              placeholder="Password"
              className="bg-none border-2 border-teal-900  rounded-xl font-bold text-teal-700 p-2"
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="submit"
              value="Sign In"
              className="bg-teal-400 w-full tracking-wide font-semibold foucs:outline-none rounded-xl p-2"
            />
          </div>
        </form>

        <button
          onClick={toPasswordReset}
          className="bg-teal-400 w-full tracking-wide font-semibold foucs:outline-none rounded-xl p-2"
        >
          Forgot Password
        </button>
      </div>
    </div>
  );
}
