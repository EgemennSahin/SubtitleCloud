import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import Sidebar from "@/components/navigation/side-bar";
import React from "react";
import Link from "next/link";
import BottomNavigation from "@/components/navigation/bottom-bar";
import {
  ArrowLeftOnRectangleIcon,
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  FolderIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { logOut } from "@/helpers/auth";

export default function Settings({ ...props }) {
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
                  Settings
                </h1>
                <div className="flex flex-col items-center justify-center gap-6 lg:flex-row">
                  <div className="flex h-full w-1/3 flex-col items-center p-6">
                    <Link
                      href="/profile"
                      className="btn-primary mx-4 w-72 shadow-xl"
                    >
                      <div className="flex flex-col items-center py-4">
                        <UserIcon
                          className="h-12 w-12 opacity-60"
                          aria-hidden="true"
                        />

                        <div className="mt-4 text-xl">
                          Profile & Preferences
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="flex w-1/3 flex-col items-center p-6">
                    <Link
                      onClick={async () => {
                        await logOut();
                      }}
                      href="/"
                      className="focus:ring-offset-2; block w-72 transform items-center rounded-xl border-2 border-white px-10 py-2.5 text-center text-base font-medium text-slate-600 shadow-xl shadow-md transition duration-500 ease-in-out hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <div className="flex flex-col items-center py-4">
                        <ArrowLeftOnRectangleIcon
                          className="h-12 w-12 opacity-60"
                          aria-hidden="true"
                        />

                        <div className="mt-4 text-xl">Log out</div>
                      </div>
                    </Link>
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

    return {
      props: {
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
