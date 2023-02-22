import React from "react";
import Router from "next/router";

const BackButton = () => (
  <button
    className="rounded-full border border-black bg-transparent py-2 px-4 font-semibold text-black"
    onClick={() => Router.back()}
  >
    <svg
      className="h-4 w-4 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M9.707 16.707a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 1 1 1.414 1.414L5.414 9H17a1 1 0 0 1 0 2H5.414l4.293 4.293a1 1 0 0 1 0 1.414z" />
    </svg>
  </button>
);

export default BackButton;
