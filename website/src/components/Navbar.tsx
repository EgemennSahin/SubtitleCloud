import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/configs/firebase/AuthContext";
import { useRouter } from "next/router";

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
          text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-800
          hover:from-teal-400 hover:to-blue-600"
          onClick={() => handleClick("/")}
        >
          ShortZoo
        </button>
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <a
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xl py-3 px-4 rounded-lg shadow-md"
            onClick={() => handleClick("/dashboard")}
          >
            Dashboard
          </a>
          <button
            className="text-slate-800 hover:bg-slate-300 hover:text-slate-700 hover:shadow-md rounded-lg text-white text-xl font-bold py-3 px-4 cursor-pointer"
            onClick={() => logOut()}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <a
            className="text-slate-800 hover:text-slate-500 text-white font-bold py-5 px-7 cursor-pointer"
            onClick={() => handleClick("/logIn")}
          >
            Log In
          </a>
          <button
            className="bg-slate-200 hover:bg-slate-300 text-black font-bold py-5 px-7 rounded-lg shadow-md"
            onClick={() => handleClick("/signUp")}
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
