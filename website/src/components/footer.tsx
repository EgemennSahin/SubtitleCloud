import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-16">
        <div className="flex flex-wrap items-baseline lg:justify-center">
          <span className="mt-2 text-sm font-light text-slate-500">
            Copyright © 2023
            <Link
              className="tracking-relaxed mx-4 transform text-lg font-bold tracking-tighter text-blue-600 transition duration-500 ease-in-out hover:text-teal-400"
              href="/"
            >
              Shortzoo
            </Link>
            All rights reserved.{" "}
            <Link href="mailto:contact@shortzoo.com">contact@shortzoo.com</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
