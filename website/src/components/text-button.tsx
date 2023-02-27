import React, { useCallback, useEffect, useState } from "react";

interface TextButtonProps {
  onClick?: () => void;
  text: string;
  disabled?: boolean;
  size: "small" | "medium" | "large";
  color?: string;
  hover?: string;
  style?: string;
}

export default function TextButton({
  onClick,
  text,
  disabled,
  size,
  color,
  hover,
  style,
}: TextButtonProps) {
  // Set font color and padding based on size

  let padding = "";
  let fontSize = "";

  switch (size) {
    case "small":
      padding = "px-4 py-3";
      fontSize = "text-xl";
      break;
    case "medium":
      padding = "px-12 py-6";
      fontSize = "text-4xl";
      break;
    case "large":
      padding = "px-20 py-10";
      fontSize = "text-5xl";
      break;
    default:
      padding = "px-4 py-3";
      fontSize = "text-xl";
  }

  return (
    <button
      className={`${
        disabled
          ? "cursor-not-allowed bg-slate-400 text-slate-300"
          : color
          ? "text-white shadow-lg hover:drop-shadow-lg" +
            " " +
            color +
            " " +
            hover!
          : "bg-gradient-to-r from-teal-400 to-blue-600 text-white shadow-lg hover:drop-shadow-lg"
      } rounded-xl text-center transition duration-150 ease-in-out ${padding} ${fontSize} font-bold ${style}`}
      onClick={onClick}
      disabled={disabled || false}
    >
      {text}
    </button>
  );
}
