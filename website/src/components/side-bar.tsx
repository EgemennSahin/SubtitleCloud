import { logOut } from "@/helpers/auth";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex w-56 flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-slate-50 bg-white pt-5">
          <div className="flex flex-shrink-0 flex-col items-center px-4">
            <Link href="/" className="px-8 text-left focus:outline-none">
              <h2 className="block transform cursor-pointer p-2 text-xl font-medium tracking-tighter text-slate-900 transition duration-500 ease-in-out hover:text-slate-900">
                Shortzoo
              </h2>
            </Link>
          </div>
          <div className="mt-5 flex flex-grow flex-col px-4">
            <nav className="flex-1 space-y-1 bg-white">
              <ul>
                <li>
                  <Link
                    className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
                    href="/dashboard"
                  >
                    <span className="ml-4"> Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
                    href="/upload-video"
                  >
                    <span className="ml-4">Process</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
                    href="/videos"
                  >
                    <span className="ml-4">Videos</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
                    href="/settings"
                  >
                    <span className="ml-4">Settings</span>
                  </Link>
                </li>

                <li>
                  <button
                    className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-600 transition duration-500 ease-in-out hover:bg-slate-100"
                    onClick={async () => {
                      await logOut();
                    }}
                  >
                    <span className="ml-4">Log out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
