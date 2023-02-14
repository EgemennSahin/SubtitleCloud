import React, { useState } from "react";
import Link from "next/link";
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
    <nav className="sticky top-0 z-50 flex items-center justify-between flex-wrap bg-white py-3 px-8 shadow">
      <div className="flex items-center flex-shrink-0 text-white">
        {/* Add logo here */}
        <button
          className="uppercase text-3xl font-semibold tracking-wider
          text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600"
          onClick={() => handleClick("/")}
        >
          ShortZoo
        </button>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <a
            className="hidden sm:block bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-900 font-semibold text-xl py-3 px-4 rounded-lg shadow-md"
            onClick={() => handleClick("/dashboard")}
          >
            Dashboard
          </a>
          <button
            className="hidden sm:block text-slate-800 hover:bg-slate-300 hover:text-slate-700 hover:shadow-md rounded-lg text-white text-xl font-bold py-3 px-4 cursor-pointer"
            onClick={() => logOut()}
          >
            Sign Out
          </button>

          <div className="sm:hidden">
            <Dropdown></Dropdown>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            className="hidden sm:block bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xl py-3 px-4 rounded-lg shadow-md"
            onClick={() => handleClick("/signUp")}
          >
            Sign Up
          </button>
          <a
            className="hidden sm:block text-slate-800 hover:bg-slate-300 hover:text-slate-700 hover:shadow-md rounded-lg text-white text-xl font-bold py-3 px-4 cursor-pointer"
            onClick={() => handleClick("/logIn")}
          >
            Log In
          </a>

          <div className="sm:hidden">
            <Dropdown></Dropdown>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
