export default function ContentRows({
  title,
  header,
  main,
}: {
  title: string;
  header: string;
  main: { title: string; paragraph: string }[];
}) {
  return (
    <section>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 py-8 sm:px-6 lg:px-8">
        <div className="prose prose-blue mx-auto flex w-full max-w-3xl flex-col text-left">
          <div className="mx-auto w-full">
            <h1 className="mb-8 text-3xl font-bold leading-none tracking-tight text-slate-600 md:text-6xl lg:text-4xl">
              {title}
            </h1>
            <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-blue-600">
              {header}
            </h2>
            {main.map((item, index) => {
              let w = "";
              switch (index) {
                case 0:
                  w = "32";
                  break;
                case 1:
                  w = "24";
                  break;
                case 2:
                  w = "16";
                  break;
                default:
                  w = "12";
              }

              return (
                <>
                  <h3 className="text-lg font-medium tracking-wide">
                    {item.title}
                  </h3>
                  <div className="my-1 flex items-center">
                    <div className={`w-${w} border-t border-teal-400`}></div>
                  </div>
                  <p className="mb-8 text-left text-base leading-relaxed text-slate-600">
                    {item.paragraph}
                  </p>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
