import React, { useState } from "react";
import { useAuth } from "@/configs/firebase/AuthContext";
import { useRouter } from "next/router";
import Dropdown from "./Dropdown";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white py-3 px-8 shadow">
      <div className="flex flex-shrink-0 items-center text-white">
        {/* Add logo here */}
        <button
          className="flex items-center bg-gradient-to-r from-teal-400
          to-blue-600 bg-clip-text text-2xl font-semibold uppercase tracking-wider text-transparent sm:text-4xl"
          onClick={() => router.push("/")}
        >
          <img
            src="/logo.svg"
            alt="Shortzoo Logo"
            className="mr-2 h-6 w-6 sm:h-10 sm:w-10"
          />
          ShortZoo
        </button>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <a
            className="hidden cursor-pointer rounded-lg bg-blue-100 py-3 px-4 text-xl font-semibold text-blue-700 shadow-md hover:bg-blue-200 hover:text-blue-900 sm:block"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </a>
          <button
            className="hidden cursor-pointer rounded-lg py-3 px-4 text-xl font-bold text-slate-700 hover:bg-slate-300 hover:text-slate-800 hover:shadow-md sm:block"
            onClick={async () => {
              await logOut();
            }}
          >
            Log out
          </button>

          <div className="sm:hidden">
            <Dropdown>
              <a
                onClick={() => router.push("/dashboard")}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Dashboard
              </a>
              <a
                onClick={() => {
                  logOut();
                  router.push("/");
                }}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Log out
              </a>
            </Dropdown>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            className="hidden rounded-lg bg-slate-200 py-3 px-4 text-xl font-semibold text-slate-700 shadow-md hover:bg-slate-300 sm:block"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </button>
          <a
            className="hidden cursor-pointer rounded-lg py-3 px-4 text-xl font-bold text-slate-700 hover:bg-slate-300 hover:text-slate-800 hover:shadow-md sm:block"
            onClick={() => router.push("/login")}
          >
            Log in
          </a>

          <div className="sm:hidden">
            <Dropdown>
              <a
                onClick={() => router.push("/signup")}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Sign up
              </a>
              <a
                onClick={() => router.push("/signup")}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Log in
              </a>
            </Dropdown>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
