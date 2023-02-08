import React from "react";
import Router from "next/router";

const BackButton = () => (
  <button
    className="bg-transparent text-black font-semibold py-2 px-4 border border-black rounded-full"
    onClick={() => Router.back()}
  >
    <svg
      className="fill-current h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M9.707 16.707a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 1 1 1.414 1.414L5.414 9H17a1 1 0 0 1 0 2H5.414l4.293 4.293a1 1 0 0 1 0 1.414z" />
    </svg>
  </button>
);

export default BackButton;
