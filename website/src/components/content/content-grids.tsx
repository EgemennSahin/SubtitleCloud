export default function ContentGrids({
  grids,
}: {
  grids: { title: string; icon: any; body: string; link?: string }[];
}) {
  return (
    <section>
      <div className="relative mx-auto w-full max-w-7xl items-center px-5 py-12 md:px-12 lg:px-24">
        <div className="mx-auto grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {grids.map((item) => {
            return (
              <>
                <div className="rounded-xl bg-slate-100 p-8 shadow-inner">
                  <div className="mx-auto mb-5 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {item.icon}
                  </div>

                  <h1 className="mx-auto mb-8 text-2xl font-semibold leading-none tracking-tighter text-slate-700 lg:text-3xl">
                    {item.title}
                  </h1>
                  <p className="mx-auto text-base leading-relaxed text-slate-600">
                    {item.body}
                  </p>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
}
