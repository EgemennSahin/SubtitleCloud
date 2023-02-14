import React, { useCallback, useEffect, useState } from "react";


interface TextButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
}

function TextButton({ onClick, text, disabled }: TextButtonProps) {
  return (
    <button
      className={`${
        disabled
          ? "cursor-not-allowed bg-slate-400 text-slate-300"
          : "bg-gradient-to-r from-teal-400 to-blue-600 text-white drop-shadow-xl transition ease-in-out hover:scale-110 hover:shadow-xl"
      } duration-80 transform rounded-xl py-10 px-20 text-3xl font-bold`}
      onClick={onClick}
      disabled={disabled || false}
    >
      {text}
    </button>
  );
}

export default TextButton;
