import { ThreeCarouselColumns } from "@/components/carousel";

export default function NewPage({ uid }: { uid: string }) {
  return (
    <div className="relative h-screen grow overflow-hidden bg-white">
      <div className="mx-auto h-full max-w-7xl">
        <div className="relative z-10 h-full bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 h-full px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="flex h-full w-full flex-col items-start justify-between md:flex-row md:justify-start">
              <div className="z-20 flex h-1/2 w-full flex-col items-center justify-start text-left md:z-30 md:w-1/2 md:items-start md:justify-center">
                <h1 className="titleHome text-6xl font-extrabold tracking-tight text-gray-900 ">
                  <span className="m-auto flex w-full text-indigo-600">
                    Shortzoo
                  </span>
                  <span className="block font-bold xl:inline">
                    <span className="absolute">Enhance</span>
                    <br />
                    your videos
                  </span>
                </h1>
                <h2 className="mt-3 text-lg text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl md:mt-5 md:text-xl lg:mx-0">
                  Shortzoo gives you access to premium AI models that
                  <span className="font-bold text-gray-700"> caption </span>
                  your videos. You can also add
                  <span className="font-bold text-gray-700">
                    {" "}
                    secondary content{" "}
                  </span>
                  to your videos and make them more engaging
                </h2>
                <div className="mt-5 w-full sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 px-8 py-2 py-3 text-base font-medium text-white hover:bg-indigo-700"
                      href="/process-video"
                    >
                      {uid ? "Go to your dashboard" : "Get started"}
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  Need specific or new feature?{" "}
                  <span className="cursor-pointer underline">
                    Make a request
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-20 -right-20 z-10 w-full transform opacity-10 sm:text-center md:z-50 md:w-1/2 md:opacity-70 lg:text-left">
                <div className="flex gap-4 gap-y-1">
                  <ThreeCarouselColumns />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Link from "next/link";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getToken({ context });

    return {
      props: {
        uid: token?.uid || null,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
