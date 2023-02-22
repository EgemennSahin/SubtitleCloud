import React, { useCallback, useEffect, useState } from "react";

interface TextButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  size: "small" | "medium" | "large";
  color?: string;
}

function TextButton({ onClick, text, disabled, size, color }: TextButtonProps) {
  // Set font color and padding based on size
  const [fontColor, setFontColor] = useState("text-white");
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
          ? "text-white drop-shadow-xl transition ease-in-out hover:scale-105 hover:shadow-xl " +
            color
          : "bg-gradient-to-r from-teal-400 to-blue-600 text-white drop-shadow-xl transition ease-in-out hover:scale-105 hover:shadow-xl"
      }  duration-80 transform rounded-xl ${padding} ${fontSize} font-bold`}
      onClick={onClick}
      disabled={disabled || false}
    >
      {text}
    </button>
  );
}

export default TextButton;
