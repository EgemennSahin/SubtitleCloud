import React, { useCallback, useEffect, useState } from "react";

interface TextButtonProps {
  onClick?: () => void;
  text: string;
  disabled?: boolean;
  size: "small" | "medium" | "large";
  color: string;
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

  switch (color) {
    case "primary":
      color = "bg-blue-600";
      hover = "hover:bg-blue-500";
      break;
    case "secondary":
      color = "bg-teal-500";
      hover = "hover:bg-teal-400";
      break;
    case "gray":
      color = "bg-slate-600";
      hover = "hover:bg-slate-500";
      break;
    case "red":
      color = "bg-red-500";
      hover = "hover:bg-red-400";
      break;
    default:
      color = "bg-gradient-to-r from-teal-400 to-blue-600";
      hover = "hover:from-teal-500 hover:to-blue-700";
  }

  return (
    <button
      className={`${
        disabled
          ? "cursor-not-allowed bg-slate-400 text-slate-100"
          : `text-white shadow-lg hover:drop-shadow-lg ${color} ${hover}`
      } rounded-xl text-center transition duration-150 ease-in-out ${padding} ${fontSize} font-bold ${style}`}
      onClick={onClick}
      disabled={disabled || false}
    >
      {text}
    </button>
  );
}
