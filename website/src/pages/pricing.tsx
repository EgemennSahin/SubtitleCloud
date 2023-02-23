// Create a default react page

import TextButton from "@/components/TextButton";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const toggle = () => {
    setIsAnnual(!isAnnual);
  };

  const router = useRouter();
  return (
    <>
      <Head>
        <title>Pricing - Shortzoo</title>
        <meta
          name="description"
          content="Discover our pricing plans and choose the one that fits your needs. Subscribe now and start enjoying our premium features."
        />
      </Head>
      <div className="relative grow bg-gradient-to-b from-slate-50 to-slate-200 px-6 py-5 sm:py-9 md:px-8 lg:px-20">
        <h1 className="mb-3 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text pr-1 text-center text-6xl font-bold leading-tight tracking-tighter text-transparent ">
          Pricing
        </h1>
        <h2 className="mb-4 bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text pr-1 text-center text-3xl font-semibold tracking-tight text-transparent sm:mb-4">
          Our plans are designed to fit your needs and budget.
        </h2>

        <div className="flex-flex-col">
          <div
            className="mb-4 flex items-center justify-start space-x-2"
            onClick={toggle}
          >
            <p
              className={`text-md font-medium  ${
                isAnnual ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Monthly
            </p>
            <div
              className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full bg-slate-400 transition-colors duration-200 ease-in ${
                isAnnual ? "bg-slate-600" : ""
              }`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`mx-1 inline-block h-5 w-5 transform self-center rounded-full bg-slate-100 shadow ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? "translate-x-5 bg-slate-100" : ""
                }`}
              />
            </div>
            <p
              className={`text-md font-medium  ${
                isAnnual ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Annual <span className="text-teal-500">(20% off!)</span>
            </p>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div className="flex w-full rounded-xl bg-slate-300 p-1 shadow-2xl lg:w-1/3">
              <div className="flex w-full flex-col rounded-lg bg-slate-100 px-8 pt-4 pb-6">
                <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-600">
                  Basic
                </h2>
                <h3 className="mt-3 text-center text-xl text-slate-600">
                  Always free
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-y-4 text-2xl md:text-lg">
                  <p className="text-slate-700">Videos:</p>
                  <p className="text-slate-700">5</p>
                  <p className="text-slate-700">Length:</p>
                  <p className="text-slate-700">1 minute</p>
                  <p className="text-slate-700">Publish:</p>
                  <p className="text-slate-700">None</p>
                </div>
                <TextButton
                  size="small"
                  text="Try now"
                  color="bg-teal-500"
                  hover="hover:bg-teal-600"
                  style="mt-8"
                  onClick={() => {
                    router.push("/process-video");
                  }}
                />
              </div>
            </div>
            <div className="flex w-full rounded-xl bg-gradient-to-br from-slate-300 via-slate-300 to-blue-400 p-1 shadow-2xl lg:w-1/3">
              <div className="flex w-full flex-col rounded-lg bg-slate-100 px-8 pt-4 pb-6">
                <h2 className="bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-center text-3xl font-semibold tracking-tight text-transparent">
                  Premium
                </h2>

                <h3 className="mt-3 text-center text-xl text-slate-600">
                  {isAnnual ? "$47.99" : "$4.99"}
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-y-4 text-2xl md:text-lg">
                  <p className="text-slate-700">Videos:</p>
                  <p className="text-slate-700">20</p>
                  <p className="text-slate-700">Length:</p>
                  <p className="text-slate-700">3 minutes</p>
                  <p className="text-slate-700">Publish:</p>
                  <div className="flex gap-2">
                    <img
                      src="/logos/youtube.svg"
                      alt="Youtube"
                      className="h-6 w-6"
                    />
                    <img
                      src="/logos/instagram.svg"
                      alt="Instagram"
                      className="h-6 w-6"
                    />
                    <img
                      src="/logos/tiktok.svg"
                      alt="Tiktok"
                      className="h-6 w-6"
                    />
                  </div>
                </div>

                <TextButton
                  size="small"
                  text="Subscribe"
                  style="mt-8"
                  onClick={() => {
                    router.push("/signup");
                  }}
                />
              </div>
            </div>
            <div className="flex w-full rounded-xl bg-slate-400 p-1 shadow-2xl lg:w-1/3">
              <div className="flex w-full flex-col rounded-lg bg-gradient-to-b from-slate-600 via-slate-800 to-slate-900 px-8 pt-4 pb-6">
                <h2 className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-center text-3xl font-semibold tracking-tight text-transparent">
                  Business
                </h2>
                <h3 className="mt-3 text-center text-xl text-slate-200">
                  Customized for you
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-y-4 text-2xl md:text-lg">
                  <p className="text-slate-200">Videos:</p>
                  <p className="text-slate-200">100/$9.99</p>
                  <p className="text-slate-200">Length:</p>
                  <p className="text-slate-200">No limit</p>
                  <p className="text-slate-200">Publish:</p>
                  <div className="flex gap-2">
                    <img
                      src="/logos/youtube.svg"
                      alt="Youtube"
                      className="h-6 w-6"
                    />
                    <img
                      src="/logos/instagram.svg"
                      alt="Instagram"
                      className="h-6 w-6"
                    />
                    <img
                      src="/logos/tiktok.svg"
                      alt="Tiktok"
                      className="h-6 w-6"
                    />
                  </div>
                </div>

                <TextButton
                  size="small"
                  text="Contact us"
                  color="bg-amber-600"
                  hover="hover:bg-amber-700"
                  style="mt-8"
                  onClick={() => {
                    router.push("/signup");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
