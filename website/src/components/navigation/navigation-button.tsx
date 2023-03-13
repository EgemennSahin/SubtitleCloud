import Link from "next/link";
import React from "react";

export default function NavigationButton({
  link,
  Icon,
  text,
}: {
  link: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text?: string;
}) {
  return (
    <Link
      href={link}
      className="flex transform flex-col items-center justify-center rounded-xl bg-blue-600 px-8 py-6 text-center font-medium text-white shadow-xl transition duration-500 ease-in-out hover:bg-blue-700"
    >
      <Icon className="h-12 w-12 opacity-60" />

      <div className="mt-2 text-xl">{text}</div>
    </Link>
  );
}
