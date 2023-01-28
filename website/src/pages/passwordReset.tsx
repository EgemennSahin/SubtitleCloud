import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/configs/firebaseConfig";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import BackButton from "@/components/backbutton";

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
    <div className="w-1/3 mx-auto">
      <h2 className="text-center font-normal mt-32 text-2xl text-teal-800">
        Firebase 9 Authentication <br /> Reset Password
      </h2>

      <form onSubmit={handlePasswordReset}>
        {message && (
          <p className="text-center text-xs mt-3 text-green-400">{message}</p>
        )}
        {error && (
          <p className="text-center text-xs mt-3 text-red-400">{error}</p>
        )}
        <div className="my-2 flex flex-col">
          <label className="text-teal-900 font-bold text-lg tracking-wide">
            Email
          </label>
          <input
            type="email"
            placeholder="E-mail"
            className="bg-none border-4 border-teal-900 focus:outline-none rounded-xl font-bold text-teal-700 my-2 p-2"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="submit"
            value="Reset Password"
            className="bg-teal-400 w-full tracking-wide font-semibold foucs:outline-none rounded-xl p-2 my-2"
          />
        </div>
      </form>
    </div>
  );
}
