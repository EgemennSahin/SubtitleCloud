import { logOut } from "@/helpers/auth";
import { User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBarDropdown from "./nav-bar-dropdown";
import TextButton from "./text-button";

function Navbar({ user }: { user: User }) {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white py-3 px-8 shadow">
      <div className="flex flex-shrink-0 items-center text-white">
        <Link className="flex items-center" href="/">
          <Image
            src="/shortzoo-logo/logo.svg"
            alt="Shortzoo Logo"
            width="0"
            height="0"
            sizes="100vw"
            className="h-10 w-10"
          />
          <span
            className="hidden bg-gradient-to-r from-teal-400 to-blue-600
          bg-clip-text px-2 py-2 text-2xl font-semibold uppercase tracking-wider text-transparent hover:from-teal-500
          hover:to-blue-700 sm:block"
          >
            ShortZoo
          </span>
        </Link>

        {!user && (
          <a
            className="transition-textcolor mx-5 cursor-pointer p-3 text-xl font-bold tracking-wide text-slate-700 hover:text-slate-900"
            onClick={() => router.push("/pricing")}
          >
            Pricing
          </a>
        )}
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <TextButton
              text="Dashboard"
              size="small"
              color="bg-slate-500"
              style="hidden sm:block"
              hover="hover:bg-slate-600"
            />
          </Link>

          <a
            className="transition-textcolor hidden cursor-pointer py-3 px-4 text-xl font-bold tracking-wide text-slate-500 hover:text-slate-900 sm:block"
            onClick={async () => {
              await logOut();
              router.push("/");
            }}
          >
            Log out
          </a>

          <div className="sm:hidden">
            <NavBarDropdown>
              <Link href="/dashboard">
                <button className="w-full px-4 py-4 text-left text-lg font-medium text-gray-700">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={async () => {
                  await logOut();
                  router.push("/");
                }}
                className="w-full rounded-b-md px-4 py-4 text-left text-lg font-medium text-gray-700"
              >
                Log out
              </button>
            </NavBarDropdown>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <TextButton
            onClick={() => router.push("/signup")}
            text="Sign up"
            size="small"
            color="bg-slate-500"
            style="hidden sm:block"
            hover="hover:bg-slate-600"
          />

          <a
            className="transition-textcolor hidden cursor-pointer py-3 px-4 text-xl font-bold tracking-wide text-slate-500 hover:text-slate-900 sm:block"
            onClick={() => router.push("/login")}
          >
            Log in
          </a>

          <div className="sm:hidden">
            <NavBarDropdown>
              <button
                onClick={() => router.push("/signup")}
                className="w-full px-4 py-4 text-left text-lg font-medium text-gray-700"
              >
                Sign up
              </button>
              <button
                onClick={() => router.push("/login")}
                className="w-full rounded-b-md px-4 py-4 text-left text-lg font-medium text-gray-700"
              >
                Log in
              </button>
            </NavBarDropdown>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
