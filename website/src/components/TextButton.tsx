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

function TextButton({
  onClick,
  text,
  disabled,
  size,
  color,
  hover,
  style,
}: TextButtonProps) {
  // Set font color and padding based on size
  const [padding, setPadding] = useState("px-12 py-6");
  const [fontSize, setFontSize] = useState("text-4xl");

  useEffect(() => {
    if (size === "small") {
      setPadding("px-4 py-3");
      setFontSize("text-xl");
    } else if (size === "medium") {
      setPadding("px-12 py-6");
      setFontSize("text-4xl");
    } else if (size === "large") {
      setPadding("px-20 py-10");
      setFontSize("text-5xl");
    }
  }, [size]);

  return (
    <button
      className={`${
        disabled
          ? "cursor-not-allowed bg-slate-400 text-slate-300"
          : color
          ? "text-white drop-shadow-xl duration-200" +
            " " +
            color +
            " " +
            hover!
          : "bg-gradient-to-r from-teal-400 to-blue-600 text-white drop-shadow-xl duration-100 hover:scale-105 hover:shadow-xl"
      } rounded-xl text-center transition ease-in-out ${padding} ${fontSize} font-bold ${style}`}
      onClick={onClick}
      disabled={disabled || false}
    >
      {text}
    </button>
  );
}

export default TextButton;
