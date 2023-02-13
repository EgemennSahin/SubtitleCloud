import React from "react";
import { Element, scroller } from "react-scroll";

const LandingPage = () => {
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
      <div className="w-full min-h-screen max-h-full py-10 px-16 bg-gradient-to-b from-white to-slate-200">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl text-transparent bg-gradient-to-r bg-clip-text from-slate-700 to-slate-800 font-bold mb-4 tracking-tighter">
            Add Captions to Video
          </h1>
          <p className="text-3xl tracking-tight font-semibold text-transparent bg-gradient-to-r bg-clip-text from-slate-500 to-slate-700 mb-8">
            Enhance your short video with accurate subtitles.
          </p>

          <div className="flex items-center justify-center mb-10">
            <button
              className="bg-gradient-to-r from-teal-300 to-blue-400 text-3xl text-white font-bold py-10 px-20 rounded-xl drop-shadow-xl hover:shadow-xl transition duration-50 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              onClick={() => scrollToSection("uploadFiles")}
            >
              Start Now
            </button>
          </div>

          <ul className="list-disc list-inside space-y-6">
            <li className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M17.293 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-2xl font-semibold text-slate-600">
                Caption every word
              </span>
            </li>

            <li className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M17.293 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-2xl font-semibold text-slate-600">
                Easy to use
              </span>
            </li>

            <li className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M17.293 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-2xl font-semibold text-slate-600">
                Increase engagement
              </span>
            </li>

            <li className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M17.293 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-2xl font-semibold text-slate-600">
                Increase accessibility
              </span>
            </li>
          </ul>
        </div>
      </div>

      <Element
        name="uploadFiles"
        className="w-screen min-h-screen max-h-full bg-gradient-to-b from-slate-200 to-slate-400"
      >
        <div> test</div>
      </Element>
    </div>
  );
};

export default LandingPage;
