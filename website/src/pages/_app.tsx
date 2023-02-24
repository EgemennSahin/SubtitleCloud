import Navbar from "@/components/nav-bar";
import { useIdTokenListener } from "@/helpers/auth";

import "@/styles/globals.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  useIdTokenListener();

  return (
    <div className="flex max-h-fit min-h-screen flex-col">
      <Navbar {...pageProps} />
      <Component {...pageProps} />
    </div>
  );
}
