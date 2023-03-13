import { logOut } from "@/helpers/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBarDropdown from "./nav-bar-dropdown";

function Navbar({ uid }: { uid: string }) {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white py-3 px-8 shadow md:px-16">
      <span className="flex flex-row items-center justify-between lg:justify-start">
        <Link
          className="transform text-lg font-bold tracking-tighter text-blue-600 transition duration-500 ease-in-out hover:text-teal-400 lg:pr-8"
          href="/"
        >
          Shortzoo
        </Link>
      </span>

      {uid ? (
        <div className="flex items-center gap-4">
          <div className="inline-flex list-none items-center gap-2 lg:ml-auto">
            <Link href="/dashboard" className="btn-primary">
              Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="inline-flex list-none items-center gap-2 lg:ml-auto">
            <Link href="/login" className="btn-secondary">
              Log in
            </Link>
            <Link
              href="/signup"
              className="focus:ring-offset-2; hidden transform items-center rounded-xl bg-blue-600 px-10 py-3 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2
 focus:ring-blue-500 sm:block"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
