import AnimateBlob from "../animate-blob";

export default function ContentGrids({
  grids,
}: {
  grids: { title: string; image: string; body: string; link?: string }[];
}) {
  return (
    <section>
      <div className="relative mx-auto w-full max-w-7xl items-center px-5 py-12 md:px-12 lg:px-24">
        <AnimateBlob color="blue" position="-bottom-36 left-12" />

        <div className="mx-auto grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {grids.map((item) => {
            return (
              <>
                <div className="p-6">
                  <img
                    className="mb-8 w-full rounded-xl object-cover object-center md:h-36 lg:h-48"
                    src={item.image}
                    alt="blog"
                  />

                  <h1 className="mx-auto mb-8 text-2xl font-semibold leading-none tracking-tighter text-neutral-600 lg:text-3xl">
                    {item.title}
                  </h1>
                  <p className="mx-auto text-base leading-relaxed text-gray-500">
                    {item.body}
                  </p>

                  {item.link && (
                    <div className="mt-4">
                      <a
                        href={item.link}
                        className="mt-4 inline-flex items-center font-semibold text-blue-600 hover:text-neutral-600 lg:mb-0"
                        title="read more"
                      >
                        Read More »
                      </a>
                    </div>
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
}
