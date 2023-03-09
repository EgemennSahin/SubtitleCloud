import Link from "next/link";

export default function ContentLarge({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="w-full bg-white">
      <div className="relative mx-auto w-full max-w-7xl items-center px-5 py-12 md:px-12 lg:px-16 lg:py-24">
        <div className="mx-auto flex w-full text-left">
          <div className="relative mx-auto inline-flex items-center align-middle">
            <div className="text-center">
              <h1 className="max-w-5xl text-2xl font-bold leading-none tracking-tighter text-slate-600 md:text-5xl lg:max-w-7xl lg:text-6xl">
                {title}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-teal-700 lg:mt-8">
                {body}
              </p>
              <div className="mt-6 flex justify-center">
                <div className="mt-3 rounded-lg sm:mt-0">
                  <Link href="/dashboard" className="btn-primary">
                    Get started for free with Shortzoo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
