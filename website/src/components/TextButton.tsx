import React, { useCallback, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface TextButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  recaptcha?: boolean;
}

function TextButton({ onClick, text, disabled, recaptcha }: TextButtonProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [token, setToken] = useState<string | null>(null);

  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("test");
    // Do whatever you want with the token
    setToken(token);
    console.log("Token: ", token);
  }, [executeRecaptcha]);

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  return (
    <button
      className={`${
        disabled
          ? "cursor-not-allowed bg-slate-400 text-slate-300"
          : "bg-gradient-to-r from-teal-400 to-blue-600 text-white drop-shadow-xl transition ease-in-out hover:scale-110 hover:shadow-xl"
      } duration-80 transform rounded-xl py-10 px-20 text-3xl font-bold`}
      onClick={() => {
        if (recaptcha) {
          handleReCaptchaVerify();

          if (token) {
            onClick();
          }
        } else {
          onClick();
        }
      }}
      disabled={disabled || false}
    >
      {text}
    </button>
  );
}

export default TextButton;
