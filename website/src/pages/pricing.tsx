// Create a default react page
import TextButton from "@/components/text-button";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

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
        <h2 className="mb-8 bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text pr-1 text-center text-3xl font-semibold tracking-tight text-transparent sm:mb-4">
          Our plans are designed to fit your needs and budget.
        </h2>

        <div
          className="mb-8 flex items-center justify-center space-x-2"
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
            className={`inline-flex h-7 w-12 flex-shrink-0 rounded-full bg-slate-400 transition-colors duration-200 ease-in ${
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
            Annual{" "}
            <span className="font-bold text-teal-500">(3 months free)</span>
          </p>
        </div>

        <div className="flex-flex-col">
          <div className="flex flex-col justify-center gap-6 md:flex-row">
            <div className="flex w-full rounded-xl bg-gradient-to-br from-slate-300 via-slate-300 to-blue-400 p-1 shadow-2xl lg:w-1/3">
              <div className="flex w-full flex-col rounded-lg bg-slate-100 px-8 pt-4 pb-6">
                <h2 className="bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-center text-3xl font-semibold tracking-tight text-transparent">
                  Premium
                </h2>

                <h3 className="mt-3 text-center text-xl font-bold text-slate-600">
                  {isAnnual ? "$26.99" : "$2.99"}
                </h3>
                <div className="mx-8 mt-4 grid grid-cols-2 gap-y-4 text-2xl md:text-lg">
                  <p className="text-slate-700">Videos:</p>
                  <p className="text-slate-700">30</p>
                  <p className="text-slate-700">Length:</p>
                  <p className="text-slate-700">3 minutes</p>
                  <p className="text-slate-700">Publish:</p>
                  <div className="flex gap-2">
                    <Image
                      src="/logos/youtube.svg"
                      alt="Youtube"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                    <Image
                      src="/logos/instagram.svg"
                      alt="Instagram"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                    <Image
                      src="/logos/tiktok.svg"
                      alt="Tiktok"
                      width="0"
                      height="0"
                      sizes="100vw"
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
                <h3 className="mt-3 text-center text-xl font-bold text-slate-200">
                  Customized for you
                </h3>
                <div className="mx-8 mt-4 grid grid-cols-2 gap-y-4 text-2xl md:text-lg">
                  <p className="text-slate-200">Videos:</p>
                  <p className="text-slate-200">100/$4.99</p>
                  <p className="text-slate-200">Length:</p>
                  <p className="text-slate-200">No limit</p>
                  <p className="text-slate-200">Publish:</p>
                  <div className="flex gap-2">
                    <Image
                      src="/logos/youtube.svg"
                      alt="Youtube"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                    <Image
                      src="/logos/instagram.svg"
                      alt="Instagram"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                    <Image
                      src="/logos/tiktok.svg"
                      alt="Tiktok"
                      width="0"
                      height="0"
                      sizes="100vw"
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

import { GetServerSidePropsContext } from "next";
import { getIdToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getIdToken({ context });

    const user = await getUser({ uid: token?.uid });

    return {
      props: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    return handleError(error);
  }
}
