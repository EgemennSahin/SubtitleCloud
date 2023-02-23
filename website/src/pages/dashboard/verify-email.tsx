import { sendEmailVerification } from "firebase/auth";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import TextButton from "@/components/TextButton";
import { useAuth } from "@/configs/firebase/AuthContext";
import Head from "next/head";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [emailSent, setEmailSent] = React.useState(false);
  const [emailSending, setEmailSending] = React.useState(false);

  async function handleVerifyEmail() {
    setEmailSending(true);
    if (!user) {
      setEmailSent(false);
    } else {
      await sendEmailVerification(user);
      setEmailSent(true);
    }

    setEmailSending(false);
  }

  // Redirect to dashboard if user becomes verified
  useEffect(() => {
    if (user?.emailVerified) {
      router.push("/dashboard");
    }
  }, [user]);

  // Allow user to resend email every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setEmailSent(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Verify Email - Shortzoo</title>
        <meta
          name="description"
          content="Verify your email to gain access to generate subtitles for your videos."
        />
      </Head>
      <div className="mx-auto mt-8 flex max-w-2xl flex-col rounded-lg bg-white px-16 py-14 drop-shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Verify your email
        </h2>

        <h3 className="text-md mb-4 text-slate-600">
          Click the button to verify{" "}
          {user?.email && <span className="font-semibold">{user.email}</span>}
        </h3>

        <TextButton
          size="small"
          color={emailSending ? "bg-slate-500" : "bg-teal-500"}
          hover={emailSending ? "" : "hover:bg-teal-600"}
          text={
            emailSending ? "Sending" : emailSent ? "Email sent" : "Send email"
          }
          onClick={() => handleVerifyEmail()}
          disabled={emailSent || emailSending}
        />
      </div>
    </>
  );
}
