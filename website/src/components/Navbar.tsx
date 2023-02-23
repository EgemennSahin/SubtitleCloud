import React, { useState } from "react";
import { useAuth } from "@/configs/firebase/AuthContext";
import { useRouter } from "next/router";
import Dropdown from "./Dropdown";
import TextButton from "./TextButton";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white py-3 px-8 shadow">
      <div className="flex flex-shrink-0 items-center text-white">
        {/* Add logo here */}
        <button className="flex items-center" onClick={() => router.push("/")}>
          <img src="/logo.svg" alt="Shortzoo Logo" className="h-10 w-10" />
          <span
            className="bg-gradient-to-r from-teal-400
          to-blue-600 bg-clip-text px-2 py-2 text-2xl font-semibold uppercase tracking-wider text-transparent
          hover:from-teal-500 hover:to-blue-700"
          >
            ShortZoo
          </span>
        </button>

        <a
          className="transition-textcolor mx-1 hidden cursor-pointer p-3 text-xl font-bold tracking-wide text-slate-500 hover:text-slate-900 sm:block"
          onClick={() => router.push("/pricing")}
        >
          Pricing
        </a>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <TextButton
            onClick={() => router.push("/dashboard")}
            text="Dashboard"
            size="small"
            color="bg-slate-200"
            style="hidden sm:block text-slate-700"
            hover="hover:bg-slate-300"
          />

          <a
            className="transition-textcolor hidden cursor-pointer py-3 px-4 text-xl font-bold tracking-wide text-slate-500 hover:text-slate-900 sm:block"
            onClick={async () => {
              await logOut();
            }}
          >
            Log out
          </a>

          <div className="sm:hidden">
            <Dropdown>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full px-4 py-4 text-left text-lg font-medium text-gray-700"
              >
                Dashboard
              </button>
              <button
                onClick={async () => {
                  await logOut();
                }}
                className="w-full rounded-b-md px-4 py-4 text-left text-lg font-medium text-gray-700"
              >
                Log out
              </button>
            </Dropdown>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <TextButton
            onClick={() => router.push("/signup")}
            text="Sign up"
            size="small"
            color="bg-slate-200"
            style="hidden sm:block text-slate-700"
            hover="hover:bg-slate-300"
          />

          <a
            className="transition-textcolor hidden cursor-pointer py-3 px-4 text-xl font-bold tracking-wide text-slate-500 hover:text-slate-900 sm:block"
            onClick={() => router.push("/login")}
          >
            Log in
          </a>

          <div className="sm:hidden">
            <Dropdown>
              <button
                onClick={() => router.push("/signup")}
                className="w-full px-4 py-4 text-left text-lg font-medium text-gray-700"
              >
                Sign up
              </button>
              <button
                onClick={() => router.push("/login")}
                className="w-full rounded-b-md px-4 py-4 text-left text-lg font-medium text-gray-700"
              >
                Log in
              </button>
            </Dropdown>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
