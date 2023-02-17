import Navbar from "@/components/Navbar";
import NonProtectedRoute from "@/components/NonProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContextProvider } from "@/configs/firebase/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

const noAuthRequired = ["/logIn", "/signUp", "/passwordReset"];
const authRequired = "/dashboard";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <Navbar />
      {noAuthRequired.includes(router.pathname) ? (
        <NonProtectedRoute>
          <Component {...pageProps} />
        </NonProtectedRoute>
      ) : router.pathname.startsWith(authRequired) ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthContextProvider>
  );
}
