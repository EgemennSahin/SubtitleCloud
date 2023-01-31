import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await signUp(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white min-w-fit max-w-2xl mx-auto px-16 mt-10 py-10 rounded-md drop-shadow-2xl">
      <h2 className="text-center font-bold text-3xl text-slate-800">Sign Up</h2>

      <form onSubmit={handleSignUp}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 font-bold text-lg tracking-wide">
              Email
            </label>
            <input
              type="email"
              className="bg-white border-2 border-slate-700 rounded-md text-black p-2.5"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 font-bold text-lg tracking-wide">
              Password
            </label>

            <input
              type="password"
              className="bg-white border-2 border-slate-700 rounded-md text-black p-2.5"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Sign Up"
            className="text-white font-bold rounded-md py-4 px-20 bg-blue-600 hover:bg-blue-800 transition duration-200"
          />
        </div>
      </form>
    </div>
  );
}
