import Link from "next/link";

export default function ContentLarge({
  title,
  body,
  link,
  linkText,
}: {
  title: string;
  body: string;
  link: string;
  linkText: string;
}) {
  return (
    <section className="mx-auto w-full w-full max-w-7xl items-center px-5 py-12 text-center align-middle md:px-12 lg:px-16 lg:py-24">
      <h1 className="max-w-5xl text-2xl font-bold leading-none tracking-tighter text-slate-600 md:text-5xl lg:max-w-7xl lg:text-6xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-teal-700 lg:mt-8">
        {body}
      </p>
      <div className="mt-9 flex justify-center rounded-lg sm:mt-6">
        <Link href={link} className="btn-primary">
          {linkText}
        </Link>
      </div>
    </section>
  );
}
