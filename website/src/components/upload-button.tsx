import { ArrowUpTrayIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import uploadFunctions from "@/helpers/upload";

export default function UploadButton({
  setFile,
  disabled,
  size,
}: {
  setFile: (file: File) => void;
  disabled: boolean;
  size: "small" | "large";
}) {
  const { handleDrop, handleChooseFile } = uploadFunctions(setFile);

  return (
    <div
      onDrop={handleDrop}
      onClick={handleChooseFile}
      onDragOver={(e) => e.preventDefault()}
      className={` ${
        disabled
          ? "cursor-default opacity-50"
          : "transition-textcolor cursor-pointer"
      }`}
    >
      {size === "small" ? (
        <div>
          <PlusCircleIcon className="h-16 w-16 text-teal-500" />
        </div>
      ) : (
        <div
          className="transition-textcolor flex flex-col justify-center rounded-md bg-slate-600 p-8 text-center shadow-inner-lg hover:bg-slate-700"
          style={{
            boxSizing: "border-box",
            height: "15rem",
            width: "20rem",
          }}
        >
          {disabled ? (
            <p className="text-xl font-semibold tracking-wide text-slate-300">
              Cannot upload files during processing
            </p>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <ArrowUpTrayIcon className="h-16 w-16 text-slate-50" />
              <p className="bg-gradient-to-b from-slate-100 to-slate-200 bg-clip-text text-xl font-semibold tracking-wide text-transparent sm:hidden">
                Browse your library
              </p>
              <p className="hidden bg-gradient-to-b from-slate-100 to-slate-200 bg-clip-text text-xl font-semibold tracking-wide text-transparent sm:block">
                Drag and drop <br /> or
                <span className="text-teal-300"> click</span> to browse
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
