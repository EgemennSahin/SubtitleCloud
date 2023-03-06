import { logOut } from "@/helpers/auth";
import {
  HomeIcon,
  ArrowUpTrayIcon,
  FolderIcon,
  ArrowRightOnRectangleIcon,
  CircleStackIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <ul className="flex justify-around py-2">
        <li className="flex-1">
          <Link
            href="/dashboard"
            className="block text-center text-gray-500 hover:text-gray-900"
          >
            <HomeIcon className="mx-auto h-6 w-6" />
            <span className="mt-1 text-xs">Dashboard</span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="/upload-video"
            className="block text-center text-gray-500 hover:text-gray-900"
          >
            <ArrowUpTrayIcon className="mx-auto h-6 w-6" />
            <span className="mt-1 text-xs">Upload</span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="/videos"
            className="block text-center text-gray-500 hover:text-gray-900"
          >
            <FolderIcon className="mx-auto h-6 w-6" />
            <span className="mt-1 text-xs">Videos</span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="/extras"
            className="block text-center text-gray-500 hover:text-gray-900"
          >
            <CircleStackIcon className="mx-auto h-6 w-6" />
            <span className="mt-1 text-xs">Extras</span>
          </Link>
        </li>
        <li className="flex-1">
          <div
            onClick={async () => {
              await logOut();
            }}
            className="block text-center text-gray-500 hover:text-gray-900"
          >
            <ArrowRightOnRectangleIcon className="mx-auto h-6 w-6" />
            <span className="mt-1 text-xs">Logout</span>
          </div>
        </li>
      </ul>
    </nav>
  );
}
