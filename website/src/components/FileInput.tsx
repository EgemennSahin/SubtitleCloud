import { useEffect, useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";

type FileInputProps = {
  onFile: (file: File) => void;
  disabled: boolean;
};

function FileInput({ onFile, disabled }: FileInputProps) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (file && !dragging) {
      onFile(file);
    }
  }, [file]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (
      !e.relatedTarget ||
      !e.currentTarget.contains(e.relatedTarget as Node)
    ) {
      if (e.dataTransfer.types.includes("Files")) {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("video/")) {
          setDragging(true);
        }
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (
      !e.relatedTarget ||
      !e.currentTarget.contains(e.relatedTarget as Node)
    ) {
      setDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) {
      // Close the hamburger menu on mobile
      const menu = document.querySelector(".navbar-collapse");

      if (menu) {
        menu.classList.add("hidden");
      }
    }
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    setFile(file);
  };

  const handleChooseFile = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.multiple = false;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files![0];
      // handle dropped files
      setFile(file);
    };
    input.click();
  };

  return (
    <div
      className={`flex flex-col justify-center rounded-md p-8 text-center shadow-inner-lg transition duration-200 ${
        disabled
          ? "cursor-default bg-slate-400"
          : "cursor-pointer bg-slate-600 hover:bg-slate-700"
      }`}
      style={{
        boxSizing: "border-box",
        height: "15rem",
        width: "20rem",
        border: dragging ? "2px dashed" : "none",
      }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleChooseFile}
    >
      {dragging ? (
        <p className="text-xl font-semibold tracking-wide text-slate-200">
          Drop the file here
        </p>
      ) : disabled ? (
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
            Drag and drop <br /> or <span className="text-teal-300">click</span>{" "}
            to browse
          </p>
        </div>
      )}
    </div>
  );
}

export default FileInput;
