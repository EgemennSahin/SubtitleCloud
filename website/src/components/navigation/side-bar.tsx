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
  const topButtons = [
    {
      link: "/dashboard",
      Icon: HomeIcon,
      text: "Dashboard",
    },
  ];

  const middleButtons = [
    {
      link: "/upload-video",
      Icon: ArrowUpTrayIcon,
      text: "Upload",
    },
    {
      link: "/videos",
      Icon: FolderIcon,
      text: "Videos",
    },
    {
      link: "/extras",
      Icon: CircleStackIcon,
      text: "Extras",
    },
  ];

  const bottomButtons = [
    {
      link: "/settings",
      Icon: Cog6ToothIcon,
      text: "Settings",
    },
  ];

  return (
    <>
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="sticky flex max-h-fit min-h-screen w-56 flex-grow flex-col overflow-y-auto border-r border-slate-50 bg-slate-50 pt-5">
          <Link
            href="/"
            className="mx-auto pl-2 text-lg font-bold tracking-tighter text-blue-600 transition duration-500 ease-in-out hover:text-teal-400"
          >
            Shortzoo
          </Link>

          <nav className="mx-8 mt-4">
            <ul className="flex flex-col gap-1">
              {topButtons.map((button, index) => (
                <li key={index}>
                  <IconLink
                    link={button.link}
                    Icon={button.Icon}
                    text={button.text}
                  />
                </li>
              ))}
              <div className="w-full border-t border-blue-300"></div>
              {middleButtons.map((button, index) => (
                <li key={index}>
                  <IconLink
                    link={button.link}
                    Icon={button.Icon}
                    text={button.text}
                  />
                </li>
              ))}
              <div className="w-full border-t border-slate-300"></div>
              {bottomButtons.map((button, index) => (
                <li key={index}>
                  <IconLink
                    link={button.link}
                    Icon={button.Icon}
                    text={button.text}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
