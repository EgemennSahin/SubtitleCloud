import React from "react";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import { useRouter } from "next/router";
import { logOut } from "@/helpers/auth";
import { DashboardPage } from "@/components/navigation/dashboard-page";

export default function OnboardingPage() {
  const router = useRouter();
  async function handleDeleteAccount() {
    await fetch("/api/delete-account", {
      method: "POST",
    });
    await logOut();
    router.push("/");
  }

  return (
    <>
      <Seo title="Delete Account" description="Delete your account" />

      <DashboardPage
        title="Delete account"
        subtitle={
          <h2 className="text-md text-slate-600">
            Are you sure you want to delete your account? This action is
            irreversible. <br /> You have until next month to change your mind.{" "}
            <br /> If you log in again before the
            <strong> first day of next month</strong>, your account will be
            restored.
          </h2>
        }
      >
        <button
          className="col-span-2 mt-4 block transform items-center rounded-xl border-2 border-red-600 px-10 py-3 text-center text-base font-medium text-red-600 transition duration-500 ease-in-out hover:border-red-700 hover:bg-red-700 hover:text-red-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleDeleteAccount}
        >
          Delete account
        </button>
      </DashboardPage>
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

    return {
      props: {},
    };
  } catch (error) {
    return handleError(error);
  }
}
