import FileInput from "@/components/FileInput";
import React from "react";
import { Element, scroller } from "react-scroll";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import TextButton from "@/components/TextButton";

const LandingPage = () => {
  const [file, setFile] = React.useState<File | null>(null);

  const scrollToSection = (documentId: string) => {
    scroller.scrollTo(documentId, {
      duration: 700,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -120,
    });
  };

  return (
    <div className="flex flex-wrap">
      <Element
        name="start"
        className="min-h-screen w-screen bg-gradient-to-b from-slate-50 to-slate-200"
      >
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="mb-8 bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-6xl font-bold tracking-tighter text-transparent">
            Add Captions to Video
          </h1>
          <h2 className="mb-10 bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
            Enhance your short video with accurate subtitles.
          </h2>

          <div className="mb-10 flex items-center justify-center">
            <TextButton
              onClick={() => scrollToSection("uploading")}
              text={"Start Now"}
            />
          </div>

          <ul className="flex list-inside list-disc flex-col flex-wrap gap-3">
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="h-10 w-10 text-teal-400" />
              <span className="text-2xl font-semibold text-slate-600">
                Caption every word
              </span>
            </li>

            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="h-10 w-10 text-teal-400" />

              <span className="text-2xl font-semibold text-slate-600">
                Easy to use
              </span>
            </li>

            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="h-10 w-10 text-teal-400" />

              <span className="text-2xl font-semibold text-slate-600">
                Increase engagement
              </span>
            </li>

            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="h-10 w-10 text-teal-400" />

              <span className="text-2xl font-semibold text-slate-600">
                Increase accessibility
              </span>
            </li>
          </ul>
        </div>
      </Element>

      <Element
        name="uploading"
        className="max-h-full min-h-screen w-screen bg-gradient-to-b from-slate-200 to-slate-400"
      >
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-10 bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-4xl font-bold tracking-tighter text-transparent">
            Upload your video
          </h2>

          <FileInput
            onFile={(file: File) => {
              console.log(file);
              setFile(file);
            }}
          />

          <div className="mt-10 flex items-center justify-center">
            <TextButton
              onClick={async () => {
                // TODO: Upload file

                scrollToSection("processing");
              }}
              text={"Submit"}
              disabled={!file}
            />
          </div>
        </div>
      </Element>

      <Element
        name="processing"
        className="max-h-full min-h-screen w-screen bg-gradient-to-b from-slate-400 to-slate-600"
      >
        <div> Processing</div>
        <div className="mb-10 flex items-center justify-center">
          <TextButton
            onClick={() => scrollToSection("output")}
            text={" Processed"}
          />
        </div>
      </Element>

      <Element
        name="output"
        className="max-h-full min-h-screen w-screen bg-gradient-to-b from-slate-600 to-slate-800"
      >
        <div> Output </div>
      </Element>
    </div>
  );
};

export default LandingPage;
