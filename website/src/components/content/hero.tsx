import Image from "next/image";
import Link from "next/link";

export default function Hero({
  title,
  header,
  body,
  image,
}: {
  title: string;
  header: string;
  body: React.ReactElement;
  image: string;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-center px-4 py-12 md:px-12 lg:px-24 lg:py-24">
      <div className="relative h-64 w-full sm:h-96 lg:w-1/2">
        <Image fill style={{ objectFit: "contain" }} alt="hero" src={image} />
      </div>
      <div className="mt-12 mb-16 flex flex-col items-start text-left md:mb-0 lg:w-1/2 lg:flex-grow lg:pl-6 xl:mt-0 xl:pl-24">
        <span className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-600">
          {header}
        </span>
        <h1 className="mb-8 text-4xl font-bold leading-none tracking-tighter text-slate-600 md:text-7xl lg:text-5xl">
          {title}
        </h1>
        <p className="mb-8 text-left text-base leading-relaxed text-slate-500">
          {body}
        </p>

        <div className="mt-9 flex justify-center rounded-lg sm:mt-6">
          <Link href="/dashboard" className="btn-primary">
            Get started for free with Shortzoo
          </Link>
        </div>
      </div>
    </div>
  );
}
