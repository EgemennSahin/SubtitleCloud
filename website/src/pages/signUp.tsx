import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/configs/firebase/AuthContext";
import Link from "next/link";
import TextButton from "@/components/TextButton";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
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

  const handleSignUp = async () => {
    // Check if the e-mail and password are valid
    if (!checkRegex()) {
      return;
    }

    try {
      await signUp(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl flex-col rounded-lg bg-white px-16 py-14 drop-shadow-2xl">
      <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
        Create your Shortzoo account
      </h2>

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
          {!validEmail && (
            <p
              className="absolute top-full left-0 mt-1 text-red-400"
              style={{ zIndex: 1 }}
            >
              Please enter a valid email address
            </p>
          )}
        </div>

        <div className="mb-8 flex flex-col" style={{ position: "relative" }}>
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
        <TextButton size="small" text="Sign Up" onClick={handleSignUp} />
        <Link href="/logIn" passHref>
          <p className="mt-5 text-center text-lg font-bold tracking-wide text-blue-600 hover:text-blue-500">
            Return to sign in
          </p>
        </Link>
      </div>
    </div>
  );
}
