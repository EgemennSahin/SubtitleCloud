import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import Sidebar from "@/components/navigation/side-bar";
import React from "react";
import BottomNavigation from "@/components/navigation/bottom-bar";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import { logOut } from "@/helpers/auth";
import { useRouter } from "next/router";
import { DashboardPage } from "@/components/navigation/dashboard-page";

export default function Profile({ user }: { user: any }) {
  const router = useRouter();
  return (
    <>
      <Seo
        title="Profile"
        description="Change your profile settings and account preferences."
      />

      <DashboardPage title="Profile & Preferences">
        <section className="col-span-2 flex flex-col gap-2">
          <UserIcon
            className="h-12 w-12 self-center opacity-60"
            aria-hidden="true"
          />
          <div className="mt-4 text-xl">Email: {user.email}</div>
          <button
            onClick={async () => {
              await sendPasswordResetEmail(auth, user.email);
            }}
            className="btn-primary"
          >
            Change Password
          </button>

          <button
            onClick={async () => {
              await logOut();
              router.push("/");
            }}
            className="btn-secondary"
          >
            Log out
          </button>

          <Link
            href="/delete-account"
            className="flex w-full transform items-center justify-center rounded-xl border-2 border-red-600 px-10  py-3 text-center text-base font-medium text-red-600 transition duration-500 ease-in-out hover:border-red-700 hover:bg-red-700 hover:text-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Account
          </Link>
        </section>
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
      props: {
        user: token,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
