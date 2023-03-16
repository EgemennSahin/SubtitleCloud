import React, { useState } from "react";
import { useRouter } from "next/router";
import { authGoogle, logIn } from "@/helpers/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      await logIn(email, password);

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Seo
        title="Log In"
        description="Log in to our short video subtitling solution and gain access to your account."
      />
      <Navbar uid="" />

      <section>
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-xl lg:w-96">
            <h2 className="mt-6 text-3xl font-extrabold text-neutral-600">
              Log in
            </h2>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-600"
                    >
                      {" "}
                      Email address{" "}
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full transform rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-neutral-600"
                    >
                      {" "}
                      Password{" "}
                    </label>

                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="Your Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="block w-full transform rounded-lg border border-transparent bg-gray-50 px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full transform items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Log in
                    </button>
                  </div>
                </form>

                <div className="mt-4 flex w-full justify-between">
                  <Link
                    href="/signup"
                    className="text-end font-medium text-slate-600 hover:text-slate-500"
                  >
                    Don&apos;t have an account?
                  </Link>
                  <Link
                    href="/password-reset"
                    className="font-medium text-teal-600 hover:text-teal-500"
                  >
                    {" "}
                    Forgot your password?{" "}
                  </Link>
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-neutral-600">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={async () => {
                      await authGoogle();
                      window.location.reload();
                    }}
                    className="flex w-full transform items-center justify-center rounded-xl bg-red-600 px-10 py-4 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Log in with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import Link from "next/link";
import Navbar from "@/components/navigation/nav-bar";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getToken({ context });

    if (token) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  } catch (error) {
    return handleError(error);
  }
}
