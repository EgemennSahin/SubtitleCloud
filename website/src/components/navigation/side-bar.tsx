import { logOut } from "@/helpers/auth";
import {
  ArrowUpTrayIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import IconLink from "./icon-link";

export default function Sidebar() {
  return (
    <>
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="sticky flex flex h-screen w-56 flex-grow flex-col overflow-y-auto border-r border-slate-50 bg-slate-50 pt-5">
          <Link
            href="/"
            className="mx-auto pl-2 text-lg font-bold tracking-tighter text-blue-600 transition duration-500 ease-in-out hover:text-teal-400"
          >
            Shortzoo
          </Link>

          <div className="mt-5 flex flex-grow flex-col px-4">
            <nav className="flex-1 space-y-1">
              <ul>
                <li>
                  <IconLink
                    link="/dashboard"
                    Icon={HomeIcon}
                    text="Dashboard"
                  />
                </li>
                <li>
                  <div className="flex items-center px-8">
                    <div className="w-12 border-t border-blue-300"></div>
                  </div>
                </li>
                <li>
                  <IconLink
                    link="/upload-video"
                    Icon={ArrowUpTrayIcon}
                    text="Upload"
                  />
                </li>
                <li>
                  <IconLink link="/videos" Icon={FolderIcon} text="Videos" />
                </li>
                <li>
                  <IconLink
                    link="/extras"
                    Icon={CircleStackIcon}
                    text="Extras"
                  />
                </li>
                <li>
                  <div className="flex items-center px-8">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                </li>
                <li>
                  <IconLink
                    link="/settings"
                    Icon={Cog6ToothIcon}
                    text="Settings"
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
