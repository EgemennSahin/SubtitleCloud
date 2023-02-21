import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/configs/firebase/firebaseConfig";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import TextButton from "@/components/TextButton";
import { useAuth } from "@/configs/firebase/AuthContext";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { user } = useAuth();

  function handleVerifyEmail() {
    sendEmailVerification(user!)
      .then(() => {
        console.log("Verification email sent");
        setMessage("Check your email to verify");
      })
      .catch((error: any) => {
        console.log(error);
        setError("E-mail not found");
      });
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl flex-col rounded-lg bg-white px-16 py-14 drop-shadow-2xl">
      <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
        Verify your email
      </h2>

      <h3 className="mb-4 text-slate-600">
        Click the button and you will receive a verification email.
      </h3>

      <div className="flex flex-col">
        <TextButton
          size="small"
          text="Continue"
          onClick={() => handleVerifyEmail}
        />
      </div>
    </div>
  );
}
