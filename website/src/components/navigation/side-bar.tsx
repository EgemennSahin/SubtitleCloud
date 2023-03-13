import { logOut } from "@/helpers/auth";
import {
  ArrowUpTrayIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Sidebar() {
  return (
    <>
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="fixed flex h-screen w-56 flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-slate-50 bg-slate-50 pt-5">
            <div className="flex flex-shrink-0 flex-col items-center px-4">
              <Link href="/" className="px-8 text-left focus:outline-none">
                <h2 className="block transform cursor-pointer p-2 text-xl font-medium tracking-tighter text-slate-900 transition duration-500 ease-in-out hover:text-slate-900">
                  Shortzoo
                </h2>
              </Link>
            </div>
            <div className="mt-5 flex flex-grow flex-col px-4">
              <nav className="flex-1 space-y-1">
                <ul>
                  <li>
                    <Link
                      className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
                      href="/dashboard"
                    >
                      <HomeIcon className="my mx-4 h-4 w-4 text-slate-500" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center px-8">
                      <div className="w-12 border-t border-blue-300"></div>
                    </div>
                  </li>
                  <li>
                    <Link
                      className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
                      href="/upload-video"
                    >
                      <ArrowUpTrayIcon className="my mx-4 h-4 w-4 text-slate-500" />

                      <span>Upload</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
                      href="/videos"
                    >
                      <FolderIcon className="my mx-4 h-4 w-4 text-slate-500" />

                      <span>Videos</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
                      href="/extras"
                    >
                      <CircleStackIcon className="my mx-4 h-4 w-4 text-slate-500" />
                      <span>Extras</span>
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center px-8">
                      <div className="w-full border-t border-slate-300"></div>
                    </div>
                  </li>
                  <li>
                    <Link
                      className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
                      href="/settings"
                    >
                      <Cog6ToothIcon className="my mx-4 h-4 w-4 text-slate-500" />
                      <span>Settings</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
