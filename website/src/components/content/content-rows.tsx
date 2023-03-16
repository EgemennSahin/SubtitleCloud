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
    <section className="mx-auto max-w-4xl space-y-8 px-5 py-8 lg:px-8">
      <h1 className="text-3xl font-bold leading-none tracking-tight text-slate-600 md:text-6xl lg:text-4xl">
        {title}
      </h1>
      <h2 className="text-xs font-bold uppercase tracking-widest text-teal-500">
        {header}
      </h2>
      {main.map((item, index) => {
        return (
          <div key={"Row " + title + " " + index.toString()}>
            <h3 className="text-lg font-medium tracking-wide">{item.title}</h3>
            <div className={`my-1 w-16 border-t border-teal-400`}></div>
            <p className="leading-relaxed text-slate-600">{item.paragraph}</p>
          </div>
        );
      })}
    </section>
  );
}
