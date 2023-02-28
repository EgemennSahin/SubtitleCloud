import { sendEmailVerification, User } from "firebase/auth";
import React from "react";
import TextButton from "@/components/text-button";
import Head from "next/head";

export default function OnboardingPage({ user }: { user: User }) {
  const [status, setStatus] = React.useState("available");

  async function handleVerifyEmail() {
    if (!user) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    await sendEmailVerification(user);
    setStatus("sent");
  }

  return (
    <>
      <Head>
        <title>Verify Email - Shortzoo</title>
        <meta
          name="description"
          content="Verify your email to gain access to generate subtitles for your videos."
        />
      </Head>
      <div className="my-8 max-w-xl grow self-center rounded-lg bg-slate-50 px-16 py-14 drop-shadow-xl sm:grow-0">
        <div className="flex flex-col items-center drop-shadow">
          <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
            Verify your email
          </h2>
          <h3 className="text-md mb-4 text-slate-600">
            Click the button to verify{" "}
            {user?.email && <span className="font-semibold">{user.email}</span>}
            .
          </h3>
          <TextButton
            size="small"
            color={status == "sending" ? "bg-slate-500" : "bg-teal-500"}
            hover={status == "sending" ? "" : "hover:bg-teal-600"}
            text={
              status == "sending"
                ? "Sending"
                : status == "sent"
                ? "Email sent"
                : "Send email"
            }
            onClick={() => handleVerifyEmail()}
            disabled={status != "available"}
          />
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";

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

    if (token.email_verified) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    const user = await getUser({ uid: token.uid });

    return {
      props: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    return handleError(error);
  }
}
