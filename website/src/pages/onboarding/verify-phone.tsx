import {
  ConfirmationResult,
  PhoneAuthProvider,
  RecaptchaVerifier,
  sendEmailVerification,
  signInWithCredential,
  signInWithPhoneNumber,
  updatePhoneNumber,
  User,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { auth } from "@/config/firebase";
import { useRouter } from "next/router";
import { firebaseAdmin } from "@/config/firebase-admin";

export default function VerifyPhone({ token }: { token: DecodedIdToken }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [result, setResult] = useState("");
  const router = useRouter();
  const [appVerifier, setAppVerifier] = useState<RecaptchaVerifier | null>(
    null
  );

  useEffect(() => {
    setAppVerifier(
      new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        },
        auth
      )
    );
  }, []);

  async function handleSendCode() {
    if (!token) {
      return;
    }

    const provider = new PhoneAuthProvider(auth);
    try {
      if (phone === "" || phone.length < 10) return;

      const verificationId = await provider.verifyPhoneNumber(
        phone.replace(" ", ""),
        appVerifier!
      );

      setResult(verificationId);
      setMessageSent(true);
    } catch (error: any) {
      console.log(error);
      alert("Invalid phone number. Please try again.");
    }
  }

  async function handleVerifyCode() {
    const user = auth.currentUser;
    if (!result || !code || !user) {
      return;
    }

    const authCredential = PhoneAuthProvider.credential(result, code);

    try {
      await updatePhoneNumber(user, authCredential);
    } catch (error: any) {
      console.log(error);
      if (error.code === "auth/account-exists-with-different-credential") {
        alert("This phone number is already in use. Try a different one.");
        setMessageSent(false);
      } else alert("Invalid code. Please try again.");
    }

    // Update the token
    await fetch("/api/initialize-account", {
      method: "POST",
    });

    router.push("/dashboard");
  }

  return (
    <>
      <Seo
        title="Verify Email"
        description="Verify your email to gain access to generate subtitles for your videos."
      />
      <div className="flex overflow-hidden rounded-lg bg-white">
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6 pb-24">
              <div className="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Verify phone number
                </h1>

                <h2 className="max-w-xl text-justify text-xl text-neutral-600">
                  We need to verify your phone number to ensure that you are a
                  real person. <br /> Format your phone number as: +1 555 555
                  5555
                </h2>

                <div className="mt-8 w-full max-w-xl">
                  {messageSent ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await handleVerifyCode();
                      }}
                      className="space-y-6"
                    >
                      <div>
                        <label
                          htmlFor="tel"
                          className="block text-sm font-medium text-neutral-600"
                        >
                          Verification code
                        </label>
                        <div className="mt-1">
                          <input
                            id="tel"
                            name="tel"
                            type="tel"
                            autoComplete="tel"
                            required
                            placeholder="Your verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="block w-full transform rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="flex w-full transform items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Verify phone number
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await handleSendCode();
                      }}
                      className="space-y-6"
                    >
                      <div>
                        <label
                          htmlFor="tel"
                          className="block text-sm font-medium text-neutral-600"
                        >
                          Phone number
                        </label>
                        <div className="mt-1">
                          <input
                            id="tel"
                            name="tel"
                            type="tel"
                            autoComplete="tel"
                            required
                            placeholder="+X XXX XXX XXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="block w-full transform rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="flex w-full transform items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Send phone verification code
                      </button>

                      <div id="recaptcha-container"> </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getToken({ context });

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Refresh token
    const user = await firebaseAdmin.auth().getUser(token.uid);

    if (user.phoneNumber) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {
        token: token,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
