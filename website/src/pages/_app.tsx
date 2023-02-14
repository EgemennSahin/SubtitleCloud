import Navbar from "@/components/Navbar";
import NonProtectedRoute from "@/components/NonProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContextProvider } from "@/configs/firebase/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const noAuthRequired = ["/logIn", "/signUp", "/passwordReset"];
const noAccessRequired = ["/", "/landingPage"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_API_KEY!}
      useEnterprise={true}
    >
      <AuthContextProvider>
        <Navbar />

        {noAuthRequired.includes(router.pathname) ? (
          <NonProtectedRoute>
            <Component {...pageProps} />
          </NonProtectedRoute>
        ) : noAccessRequired.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        )}
      </AuthContextProvider>
    </GoogleReCaptchaProvider>
  );
}
