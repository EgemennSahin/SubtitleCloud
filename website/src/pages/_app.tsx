import Navbar from "@/components/Navbar";
import NonProtectedRoute from "@/components/NonProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContextProvider } from "@/configs/firebase/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";

const noAuthRequired = ["/logIn", "/signUp", "/passwordReset"];
const noAccessRequired = ["/", "/landingPage"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const inDevelopment = true;
  const password = "bruh123";
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(input);
    if (input !== password) {
      alert("Passwords do not match!");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <form className="mx-auto max-w-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-2 block font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(event) => setInput(event.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-blue-500 p-3 text-white"
        >
          Submit
        </button>
      </form>
    );
  }

  return (
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
  );
}
