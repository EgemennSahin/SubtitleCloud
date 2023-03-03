export default function ToggleButton({
  state,
  setState,
  textTrue,
  textFalse,
}: {
  state: boolean;
  setState: any;
  textTrue: string;
  textFalse: string;
}) {
  return (
    <div className="flex justify-start">
      <div
        className="flex shrink cursor-pointer select-none items-center space-x-2"
        onClick={() => setState(!state)}
      >
        <p
          className={`text-md font-medium  ${
            state ? "text-slate-600" : "text-slate-400"
          }`}
        >
          {textTrue}
        </p>
        <div
          className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full bg-slate-400 shadow-inner transition-colors duration-200 ease-in ${
            state ? "bg-slate-600" : ""
          }`}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`mx-1 inline-block h-5 w-5 transform self-center rounded-full bg-slate-100 shadow ring-0 drop-shadow-md transition duration-200 ease-in-out ${
              state ? "" : "translate-x-5 bg-slate-100"
            }`}
          />
        </div>
        <p
          className={`text-md font-medium  ${
            state ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {textFalse}
        </p>
      </div>
    </div>
  );
}
