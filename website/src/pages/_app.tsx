import Navbar from "@/components/Navbar";
import NonProtectedRoute from "@/components/NonProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContextProvider } from "@/configs/firebase/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

const noAuthRequired = ["/login", "/signup"];
const authRequired = [
  "/dashboard",
  "/premium",
  "/onboarding",
  "/output-videos",
];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <div className="flex max-h-fit min-h-screen flex-col">
      <AuthContextProvider>
        <Navbar />
        {noAuthRequired.includes(router.pathname) ? (
          <NonProtectedRoute>
            <Component {...pageProps} />
          </NonProtectedRoute>
        ) : authRequired.includes(router.pathname) ? (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthContextProvider>
    </div>
  );
}
