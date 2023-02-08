import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = (props: { pathname: string }) => {
  const { user, logOut } = useAuth();

  // Remove "/" and "-" from pathname
  const styledPathname = props.pathname.replace("/", "").replace("-", " ");

  // Add a space between each word in styledPathname
  const spacedPathname = styledPathname.replace(/([A-Z])/g, " $1");

  // Capitalize styledPathname
  const capitalizedPathname =
    spacedPathname.charAt(0).toUpperCase() + spacedPathname.slice(1);

  return (
    <nav className="fixed w-full top-0 z-10 bg-slate-50 shadow">
      <div className="flex flex-col md:flex-row justify-center px-16 py-4 gap-4">
        <Link
          className="flex-initial md:w-1/3 h-full mx-auto md:my-auto"
          href="/"
          passHref
        >
          <div className="uppercase self-center text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            ShortZoo
          </div>
        </Link>

        <div className="flex-1 h-full my-auto text-center font-medium text-slate-800">
          {capitalizedPathname}
        </div>

        {user ? (
          <div className="flex w-1/3 justify-end">
            <Link href="/dashboard" passHref>
              <div className="text-white bg-blue-600 hover:bg-blue-800 rounded-lg font-medium text-sm px-5 py-2.5 text-center mr-3">
                Go to Dashboard
              </div>
            </Link>
            <Link href="/dashboard" passHref>
              <div
                onClick={() => {
                  logOut();
                }}
                className="text-blue-600 hover:text-blue-800 focus:ring-6 focus:outline-3 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign Out
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex md:w-1/3 h-full mx-auto md:my-auto justify-end">
            <Link href="/signIn" passHref>
              <div className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3">
                Sign In
              </div>
            </Link>
            <Link href="/signUp" passHref>
              <div className="text-blue-600 hover:text-blue-800 focus:ring-6 focus:outline-3 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Sign Up
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
