import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-12 lg:px-24 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center">
        <div className="w-full rounded-xl lg:w-1/2 lg:max-w-lg">
          <div className="relative mx-auto w-full max-w-lg">
            <div className="animate-blob absolute top-0 -left-4 h-72 w-72 rounded-full bg-teal-100 opacity-70 mix-blend-multiply blur-xl filter"></div>

            <div className="animate-blob animation-delay-4000 absolute -bottom-24 right-20 h-72 w-72 rounded-full bg-blue-100 opacity-70 mix-blend-multiply blur-xl filter"></div>
            <div className="relative">
              <Image
                className="mx-auto h-64 w-fit shadow-2xl sm:h-96"
                width="0"
                height="0"
                sizes="100vw"
                alt="hero"
                src="/images/illustration.png"
              />
            </div>
          </div>
        </div>
        <div className="mt-12 mb-16 flex flex-col items-start text-left md:mb-0 lg:w-1/2 lg:flex-grow lg:pl-6 xl:mt-0 xl:pl-24">
          <span className="mb-8 text-xs font-bold uppercase tracking-widest text-blue-600">
            Enhance your videos
          </span>
          <h1 className="mb-8 text-4xl font-bold leading-none tracking-tighter text-neutral-600 md:text-7xl lg:text-5xl">
            Platform for short video creators
          </h1>
          <p className="mb-8 text-left text-base leading-relaxed text-gray-500">
            Shortzoo gives you access to premium AI models that
            <span className="font-bold text-teal-500"> caption </span> your
            videos. You can also add{" "}
            <span className="font-bold text-teal-500"> secondary content </span>
            to increase viewer engagement.
          </p>
          <div className="mt-0 flex items-center lg:mt-6">
            <div className="mt-3 rounded-lg sm:mt-0">
              <Link href="/dashboard" className="btn-primary">
                Get started with Shortzoo
              </Link>
            </div>
            <div className="mt-3 rounded-lg sm:mt-0 sm:ml-3">
              <Link href="/pricing" className="btn-secondary">
                See features and pricing tiers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
