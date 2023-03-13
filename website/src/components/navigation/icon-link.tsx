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
  text: string;
}) {
  return (
    <Link
      className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-4 py-2 text-base text-slate-900 transition duration-500 ease-in-out hover:bg-slate-100"
      href={link}
    >
      <Icon className="my mx-4 h-4 w-4 text-slate-500" />
      <span>{text}</span>
    </Link>
  );
}
