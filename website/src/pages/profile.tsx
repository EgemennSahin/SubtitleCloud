import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import Sidebar from "@/components/side-bar";
import React from "react";
import BottomNavigation from "@/components/bottom-navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function DashboardPage({
  uid,
  user,
}: {
  uid: string;
  user: any;
}) {
  return (
    <>
      <Seo
        title="Dashboard"
        description="Access your generated videos on our short video subtitling solution. Generate subtitles for your videos in a few minutes."
      />

      <div className="flex overflow-hidden rounded-lg bg-white">
        <Sidebar />
        <BottomNavigation />
        <div className="flex w-0 flex-1 flex-col  overflow-hidden pb-16">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6 pb-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="mb-8 text-center text-3xl text-neutral-600">
                  Profile & Preferences
                </h1>
                <div className="flex flex-col items-center justify-center gap-6 lg:flex-row">
                  <div className="flex w-1/3 flex-col items-center p-6">
                    <div className="flex flex-col gap-2 py-4">
                      <UserIcon
                        className="h-12 w-12 self-center opacity-60"
                        aria-hidden="true"
                      />
                      <div className="mt-4 text-xl">Email: {user.email}</div>
                      <Link href="/password-reset" className="btn-primary">
                        Change Password
                      </Link>

                      <Link
                        href="/delete-account"
                        className="flex w-full transform items-center justify-center rounded-xl border-2 border-red-600 px-10  py-3 text-center text-base font-medium text-red-600 transition duration-500 ease-in-out hover:border-red-700 hover:bg-red-700 hover:text-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Delete Account
                      </Link>
                    </div>
                  </div>
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

    const user = await getUser({ uid: token.uid });

    return {
      props: {
        uid: token.uid,
        user: user?.data() || {},
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
