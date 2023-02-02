import Navbar from "@/components/Navbar";
import NonProtectedRoute from "@/components/NonProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContextProvider } from "@/contexts/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

const noAuthRequired = ["/signIn", "/signUp"];
const noAccessRequired = ["/"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <Navbar />
      <div className="py-20"></div>

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
  );
}
