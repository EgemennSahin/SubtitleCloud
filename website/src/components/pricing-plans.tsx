import router, { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import ToggleButton from "./toggle-button";
import { handleCheckout } from "@/helpers/stripe";

export default function PricingPlans({
  uid,
  state,
}: {
  uid?: string;
  state: boolean;
}) {
  const handleSubmit = async (selectedPlan: string) => {
    if (!uid) {
      router.push("/dashboard");
      return;
    }

    await handleCheckout({
      uid,
      selectedPlan,
      isMonthly: state,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mt-4 flex flex-col justify-between gap-8 lg:flex-row">
        <div className="relative flex flex-col bg-white p-8">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-600">Premium</h3>
            <p className="mt-4 flex items-baseline text-slate-600">
              <span className="text-5xl font-extrabold tracking-tight">
                {state ? 2.99 : 26.99}
              </span>
              <span className="ml-1 text-xl font-semibold">
                {state ? "/month" : "/year"}
              </span>
            </p>
            <p className="mt-6 text-slate-500">
              The essentials to provide your best work for clients.
            </p>
            <ul role="list" className="mt-6 space-y-6 border-t pt-6">
              <span className="text-lg font-semibold text-slate-600">
                What&apos;s included?
              </span>
              <li className="flex">
                <div className="inline-flex h-6 w-6 items-center rounded-xl bg-blue-600">
                  <svg
                    className="mx-auto h-4 w-4 flex-shrink-0 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-slate-600">
                  Up to 20 videos per month
                </span>
              </li>
              <li className="flex">
                <div className="inline-flex h-6 w-6 items-center rounded-xl bg-blue-600">
                  <svg
                    className="mx-auto h-4 w-4 flex-shrink-0 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-slate-600">
                  Up to 1 minute per video
                </span>
              </li>
              <li className="flex">
                <div className="inline-flex h-6 w-6 items-center rounded-xl bg-blue-600">
                  <svg
                    className="mx-auto h-4 w-4 flex-shrink-0 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-slate-600">
                  Add bottom video & music
                </span>
              </li>
              <li className="flex">
                <div className="inline-flex h-6 w-6 items-center rounded-xl bg-blue-600">
                  <svg
                    className="mx-auto h-4 w-4 flex-shrink-0 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="mx-3 text-slate-600">
                  Automatically publish to
                </span>
                {["youtube", "instagram", "tiktok"].map((platform) => (
                  <div key={platform} className="mr-2 w-6 drop-shadow">
                    <Image
                      src={`/logos/${platform}.svg`}
                      alt={platform}
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                  </div>
                ))}
              </li>
            </ul>
          </div>
          <div className="mt-6 rounded-lg">
            <button
              onClick={() => {
                handleSubmit("premium");
              }}
              className="block w-full transform items-center rounded-xl border-2 border-white bg-white px-10 py-3.5 text-center text-base font-medium text-blue-600 shadow-md transition duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              {" "}
              Get started{" "}
            </button>
          </div>
        </div>

        <div className="relative flex flex-col rounded-2xl bg-blue-600 p-8">
          <div className="relative flex-1">
            <h3 className="text-xl font-semibold text-white">Business</h3>
            <p className="mt-4 flex items-baseline text-white">
              <span className="text-5xl font-extrabold tracking-tight">
                {state ? 9.99 : 89.99}
              </span>
              <span className="ml-1 text-xl font-semibold">
                {state ? "/month" : "/year"}
              </span>
            </p>
            <p className="text-solitud mt-6 text-white">
              A plan that scales with your rapidly growing business.
            </p>
            <ul role="list" className="mt-6 space-y-6 border-t pt-6">
              <span className="text-lg font-semibold text-white">
                What&apos;s included?
              </span>
              <li className="flex">
                <div className="inline-flex h-6 w-6 items-center rounded-xl bg-white">
                  <svg
                    className="mx-auto h-4 w-4 flex-shrink-0 text-slate-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-white">
                  Up to 100 videos per month
                </span>
              </li>
              <li className="flex">
                <div className="inline-flex h-6 w-6 items-center rounded-xl bg-white">
                  <svg
                    className="mx-auto h-4 w-4 flex-shrink-0 text-slate-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-white">
                  Up to 3 minutes per video
                </span>
              </li>
              <li className="flex">
                <div className="inline-flex h-6 w-6 items-center rounded-xl bg-white">
                  <svg
                    className="mx-auto h-4 w-4 flex-shrink-0 text-slate-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-white">
                  Add bottom video & music
                </span>
              </li>
              <li className="flex">
                <div className="inline-flex h-6 w-6 items-center rounded-xl bg-white">
                  <svg
                    className="mx-auto h-4 w-4 flex-shrink-0 text-slate-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="mx-3 text-white">
                  Automatically publish to{" "}
                </span>
                {["youtube", "instagram", "tiktok"].map((platform) => (
                  <div key={platform} className="mr-2 w-6 drop-shadow">
                    <Image
                      src={`/logos/${platform}.svg`}
                      alt={platform}
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-6 w-6"
                    />
                  </div>
                ))}
              </li>
              <li className="flex">
                <div className="inline-flex h-6 w-6 items-center rounded-xl bg-white">
                  <svg
                    className="mx-auto h-4 w-4 flex-shrink-0 text-slate-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="ml-3 text-white">Personalized Support</span>
              </li>
            </ul>
          </div>
          <div className="z-50 mt-6 rounded-lg">
            <button
              onClick={() => {
                handleSubmit("business");
              }}
              className="block w-full transform items-center rounded-xl border-2 border-white bg-white px-10 py-3.5 text-center text-base font-medium text-blue-600 shadow-md transition duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              {" "}
              Get started{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
