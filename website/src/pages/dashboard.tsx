import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import Sidebar from "@/components/side-bar";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNavigation from "@/components/bottom-navigation";
import {
  ArrowUpTrayIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  FolderIcon,
} from "@heroicons/react/24/solid";
import VideoList from "@/components/video-list";

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
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <Link href="/">
                  <h1 className="mb-4 text-center text-xl text-blue-600 opacity-60 md:hidden">
                    Shortzoo
                  </h1>
                </Link>
                <h1 className="mb-3 text-center text-3xl text-slate-600">
                  Your dashboard
                </h1>
                <h2 className="mb-8 text-center text-xl text-slate-600">
                  You have {user.video_credit} credits left this month.
                </h2>
                <div className="grid grid-cols-1 items-center justify-center gap-6 lg:w-full lg:grid-cols-3">
                  <div className="flex flex-col items-center p-6">
                    <Link
                      href="/upload-video"
                      className="btn-primary w-72 shadow-xl"
                    >
                      <div className="flex flex-col items-center py-4">
                        <ArrowUpTrayIcon
                          className="h-12 w-12 opacity-60"
                          aria-hidden="true"
                        />

                        <div className="mt-4 text-xl">Upload a video</div>
                      </div>
                    </Link>
                  </div>
                  <div className="flex flex-col items-center p-6">
                    <Link href="/videos" className="btn-primary w-72 shadow-xl">
                      <div className="flex flex-col items-center py-4">
                        <FolderIcon
                          className="h-12 w-12 opacity-60"
                          aria-hidden="true"
                        />

                        <div className="mt-4 text-xl">See your videos</div>
                      </div>
                    </Link>
                  </div>
                  <div className="flex flex-col items-center p-6">
                    <Link href="/extras" className="btn-primary w-72 shadow-xl">
                      <div className="flex flex-col items-center py-4">
                        <CircleStackIcon
                          className="h-12 w-12 opacity-60"
                          aria-hidden="true"
                        />

                        <div className="mt-4 text-xl">See your extras</div>
                      </div>
                    </Link>
                  </div>
                  <div className="flex flex-col items-center p-6">
                    <Link
                      href="/settings"
                      className="btn-primary w-72 shadow-xl"
                    >
                      <div className="flex flex-col items-center py-4">
                        <Cog6ToothIcon
                          className="h-12 w-12 opacity-60"
                          aria-hidden="true"
                        />

                        <div className="mt-4 text-xl">Account settings</div>
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

    if (!token.email_verified) {
      return {
        redirect: {
          destination: "/onboarding",
          permanent: false,
        },
      };
    }

    const user = await getUser({ uid: token.uid });

    return {
      props: {
        user: user?.data(),
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
