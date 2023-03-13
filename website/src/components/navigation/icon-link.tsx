import { HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { ForwardRefExoticComponent } from "react";

export default function IconLink({
  link,
  Icon,
  text,
}: {
  link: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text?: string;
}) {
  let size = "h-6 w-6 md:h-4 md:w-4";
  switch (Icon) {
    case HomeIcon:
      size = "h-8 w-8 md:h-4 md:w-4";
      break;
  }

  return (
    <Link
      className="flex transform items-center space-x-4 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
      href={link}
    >
      <Icon className={size} />
      {text && <span>{text}</span>}
    </Link>
  );
}
