import {
  HomeIcon,
  ArrowUpTrayIcon,
  FolderIcon,
  CircleStackIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import IconLink from "./icon-link";

export default function BottomBar() {
  const buttons = [
    {
      link: "/upload-video",
      Icon: ArrowUpTrayIcon,
    },
    {
      link: "/videos",
      Icon: FolderIcon,
    },
    {
      link: "/dashboard",
      Icon: HomeIcon,
    },
    {
      link: "/extras",
      Icon: CircleStackIcon,
    },
    {
      link: "/settings",
      Icon: Cog6ToothIcon,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-slate-50 py-1 md:hidden">
      <ul className="flex items-end justify-around py-2">
        {buttons.map((button, index) => (
          <li key={index}>
            <IconLink link={button.link} Icon={button.Icon} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
