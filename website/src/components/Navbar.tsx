import React, { useState } from "react";
import { useAuth } from "@/configs/firebase/AuthContext";
import { useRouter } from "next/router";
import Dropdown from "./Dropdown";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const handleClick = (route: string) => {
    router.push(route);
  };

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white py-3 px-8 shadow">
      <div className="flex flex-shrink-0 items-center text-white">
        {/* Add logo here */}
        <button
          className="bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text
          text-3xl font-semibold uppercase tracking-wider text-transparent"
          onClick={() => handleClick("/")}
        >
          ShortZoo
        </button>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <a
            className="hidden cursor-pointer rounded-lg bg-blue-100 py-3 px-4 text-xl font-semibold text-blue-700 shadow-md hover:bg-blue-200 hover:text-blue-900 sm:block"
            onClick={() => handleClick("/dashboard")}
          >
            Dashboard
          </a>
          <button
            className="hidden cursor-pointer rounded-lg py-3 px-4 text-xl font-bold text-slate-700 hover:bg-slate-300 hover:text-slate-800 hover:shadow-md sm:block"
            onClick={() => logOut()}
          >
            Log Out
          </button>

          <div className="sm:hidden">
            <Dropdown
              Options={[
                { name: "Dashboard", onClick: () => handleClick("/dashboard") },
                { name: "Log Out", onClick: logOut },
              ]}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            className="hidden rounded-lg bg-slate-200 py-3 px-4 text-xl font-semibold text-slate-700 shadow-md hover:bg-slate-300 sm:block"
            onClick={() => handleClick("/signUp")}
          >
            Sign Up
          </button>
          <a
            className="hidden cursor-pointer rounded-lg py-3 px-4 text-xl font-bold text-slate-700 hover:bg-slate-300 hover:text-slate-800 hover:shadow-md sm:block"
            onClick={() => handleClick("/logIn")}
          >
            Log In
          </a>

          <div className="sm:hidden">
            <Dropdown
              Options={[
                { name: "Sign Up", onClick: () => handleClick("/signUp") },
                { name: "Log In", onClick: () => handleClick("/logIn") },
              ]}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
