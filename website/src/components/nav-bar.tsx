import { logOut } from "@/helpers/auth";
import { User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBarDropdown from "./nav-bar-dropdown";
import TextButton from "./text-button";

function Navbar({ uid }: { uid: string }) {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white py-3 px-8 shadow md:px-16">
      <span className="flex flex-row items-center justify-between lg:justify-start">
        <Link
          className="tracking-relaxed transform text-lg font-bold tracking-tighter text-blue-600 transition duration-500 ease-in-out hover:text-teal-400 lg:pr-8"
          href="/"
        >
          Shortzoo
        </Link>

        <Link
          className="focus:shadow-outline text-md px-4 text-gray-500 hover:text-blue-600 focus:outline-none"
          href="/pricing"
        >
          Pricing
        </Link>
      </span>

      {uid ? (
        <div className="flex items-center gap-4">
          <div className="hidden list-none items-center gap-2 md:inline-flex lg:ml-auto">
            <Link href="/dashboard" className="btn-primary">
              Dashboard
            </Link>
            <button
              className="btn-secondary"
              onClick={async () => {
                await logOut();
              }}
            >
              Log out
            </button>
          </div>

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
          <div className="hidden list-none items-center gap-2 md:inline-flex lg:ml-auto">
            <Link href="/login" className="btn-secondary">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Sign up
            </Link>
          </div>

          <div className="md:hidden">
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
