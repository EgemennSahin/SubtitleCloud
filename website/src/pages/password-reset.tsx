import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/configs/firebase/firebaseConfig";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import TextButton from "@/components/TextButton";

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
    <div className="mx-auto mt-8 max-w-2xl flex-col rounded-lg bg-white px-16 py-14 drop-shadow-2xl">
      <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
        Reset your password
      </h2>

      <h3 className="mb-4 text-slate-600">
        Enter the email associated with your account and you will receive a link
        to reset your password.
      </h3>

      <div className="flex flex-col">
        <div className="mb-8 flex flex-col" style={{ position: "relative" }}>
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
          onClick={() => handlePasswordReset}
        />
        <Link href="/login" passHref>
          <p className="mt-5 text-center text-lg font-bold tracking-wide text-blue-600 hover:text-blue-500">
            Return to sign in
          </p>
        </Link>
      </div>
    </div>
  );
}
