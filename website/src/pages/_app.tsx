import { useIdTokenListener } from "@/helpers/auth";
import "@/styles/globals.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  useIdTokenListener();

  return <Component {...pageProps} />;
}
