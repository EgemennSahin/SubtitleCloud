import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/configs/firebaseConfig";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  function handlePasswordReset(e: FormEvent) {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent");
        setMessage("Check your email to reset password");
      })
      .catch((error: any) => {
        console.log(error);
        setError("E-mail not found");
      });
  }

  return (
    <div className="bg-white max-w-2xl mx-auto p-16 rounded-md drop-shadow-2xl flex-col space-y-4">
      <h2 className="text-center font-bold text-3xl text-slate-800">
        Reset your password
      </h2>

      <p className="text-slate-600">
        Enter the email associated with your account and you will receive a link
        to reset your password.
      </p>

      <form onSubmit={handlePasswordReset}>
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-bold text-lg tracking-wide">
              Email
            </label>
            <input
              type="email"
              className="bg-white border-2 border-slate-700 rounded-md text-black p-2.5"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Continue"
            className="text-white font-bold rounded-md mt-5 py-4 px-20 bg-blue-600 hover:bg-blue-800 transition duration-200"
          />
        </div>
      </form>

      <div className="flex justify-center">
        <Link href="/signIn" passHref>
          <p className="text-blue-600 font-bold text-lg tracking-wide">
            Return to sign in
          </p>
        </Link>
      </div>
    </div>
  );
}
