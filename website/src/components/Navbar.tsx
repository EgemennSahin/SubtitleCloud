import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, logOut } = useAuth();

  return (
    <nav className="fixed w-full top-0 z-10 bg-slate-50 shadow">
      <div className="container flex flex-wrap justify-between mx-auto px-16 py-4">
        <Link className="flex items-center" href="/" passHref>
          <div className="uppercase self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Website Name
          </div>
        </Link>

        {user ? (
          <>
            <div className="flex">
              <Link className="" href="/dashboard" passHref>
                <div className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3">
                  Go to Dashboard
                </div>
              </Link>
              <Link className="flex" href="/dashboard" passHref>
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
          </>
        ) : (
          <>
            <div className="flex md:order-2">
              <Link className="" href="/signIn" passHref>
                <div className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3">
                  Sign In
                </div>
              </Link>
              <Link className="" href="/signUp" passHref>
                <div className="text-blue-600 hover:text-blue-800 focus:ring-6 focus:outline-3 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Sign Up
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
