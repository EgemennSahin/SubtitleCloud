import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import TextButton from "@/components/TextButton";
import { useRouter } from "next/router";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="flex max-h-fit min-h-screen items-start justify-center bg-gradient-to-b from-slate-50 to-slate-200 py-5 sm:py-9">
      <div className="flex w-fit flex-col items-center justify-start px-5">
        <h1 className="mb-3 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text pr-1 text-center text-6xl font-bold leading-tight tracking-tighter text-transparent ">
          Caption Video
        </h1>
        <h2 className="mb-5 bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text pr-1 text-center text-3xl font-semibold tracking-tight text-transparent sm:mb-8">
          Enhance your short video with accurate subtitles
        </h2>

        <div className="items-center justify-center p-4">
          <TextButton
            size="large"
            onClick={() => router.push("/process-video")}
            text={"Start Now"}
          />
        </div>

        <h3 className="text-md mb-6 font-normal tracking-wide text-slate-500 sm:mb-10">
          Video must be less than 60 seconds long.
        </h3>

        <ul className="grid grid-cols-1 grid-rows-2 justify-center gap-3 sm:grid-cols-2 sm:gap-7 md:gap-x-12">
          <li className="flex items-center space-x-1">
            <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />
            <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
              No sign up
            </h3>
          </li>

          <li className="flex items-center space-x-1">
            <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />

            <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
              Easy & Free
            </h3>
          </li>

          <li className="flex items-center space-x-1">
            <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />
            <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
              Caption word by word
            </h3>
          </li>

          <li className="flex items-center space-x-1">
            <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />

            <h3 className="text-2xl font-semibold text-slate-600 drop-shadow">
              Increase engagement
            </h3>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
