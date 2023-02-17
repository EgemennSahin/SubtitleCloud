import FileInput from "@/components/FileInput";
import React, { BaseSyntheticEvent, useEffect } from "react";
import { Element, scroller } from "react-scroll";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import TextButton from "@/components/TextButton";
import {
  ref,
  StorageError,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { tempStorage } from "@/configs/firebase/firebaseConfig";
import { uuidv4 } from "@firebase/util";
import { Turnstile } from "@marsidev/react-turnstile";

const LandingPage = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedVideo, setUploadedVideo] = React.useState<string | null>();
  const [processingVideo, setProcessingVideo] = React.useState(false);
  const [processedVideo, setProcessedVideo] = React.useState<string | null>();

  const [token, setToken] = React.useState<string>();
  const [gettingToken, setGettingToken] = React.useState(false);

  const scrollToSection = (documentId: string) => {
    scroller.scrollTo(documentId, {
      duration: 700,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -100,
    });
  };

  useEffect(() => {
    if (uploadedVideo != null && token != null) {
      handleVideoProcessing();
    }
  }, [uploadedVideo, token]);

  useEffect(() => {
    if (processedVideo != null) {
      scrollToSection("output");
    }
  }, [processedVideo]);

  function downloadVideo(url: string, outputName: string) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = outputName;
        a.click();
      });
  }

  async function handleVideoProcessing() {
    if (!uploadedVideo || !token) {
      console.log("Wrong parameters");
      return;
    }

    try {
      setProcessingVideo(true);

      const response_video_processing = await fetch(
        "https://us-central1-captioning-693de.cloudfunctions.net/public_process_video",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video_id: uploadedVideo,
            token: token,
          }),
        }
      );

      const data = await response_video_processing.json();
      console.log("Cloud function invoked: ", data);

      if (data.url) {
        setProcessedVideo(data.url);
      } else {
        setProcessedVideo(null);
      }

      setUploadedVideo(null);
      setProcessingVideo(false);
      return true;
    } catch {
      setUploadedVideo(null);
      setProcessingVideo(false);
      return false;
    }
  }

  async function handleFileUpload() {
    if (!file) {
      console.log("No file selected");
      return;
    } else {
      setUploading(true);
      setGettingToken(true);

      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          return;
        }

        const uid = uuidv4();
        const storageRef = ref(tempStorage, uid);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot: UploadTaskSnapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Upload progress: " + progress + "%");
          },
          (error: StorageError) => {
            console.log("Error uploading file: " + error.message);
            setUploading(false);
          },
          () => {
            setUploadedVideo(uid);
            setProcessingVideo(true);
            setUploading(false);
          }
        );
      };
    }
  }

  return (
    <div className="flex flex-wrap">
      <Element
        name="start"
        className="min-h-9/10 w-screen bg-gradient-to-b from-slate-50 to-slate-200"
      >
        <div className="mb-10 flex flex-auto flex-col items-center justify-center px-8 pt-5 sm:pt-9">
          <h1 className="mb-3 grow bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text pr-1 text-center text-6xl font-bold leading-tight tracking-tighter text-transparent ">
            Caption Video
          </h1>
          <h2 className="mb-5 shrink-0 bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text pr-1 text-center text-3xl font-semibold tracking-tight text-transparent sm:mb-8">
            Enhance your short video with accurate subtitles
          </h2>

          <div className="mb-4 flex-1 items-center justify-center p-4">
            <TextButton
              onClick={() => scrollToSection("uploading")}
              text={"Start Now"}
            />
          </div>

          <h3 className="text-md mb-6 font-normal tracking-wide text-slate-500 sm:mb-10">
            Video must be less than 60 seconds long.
          </h3>

          <ul className="grid grid-cols-1 grid-rows-2 justify-center gap-3 sm:grid-cols-2 sm:gap-7 md:gap-x-12">
            <li className="flex items-center space-x-1">
              <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />
              <h3 className="text-2xl font-semibold text-slate-600">
                No sign up
              </h3>
            </li>

            <li className="flex items-center space-x-1">
              <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />

              <h3 className="text-2xl font-semibold text-slate-600">
                Easy & Free
              </h3>
            </li>

            <li className="flex items-center space-x-1">
              <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />
              <h3 className="text-2xl font-semibold text-slate-600">
                Caption word by word
              </h3>
            </li>

            <li className="flex items-center space-x-1">
              <CheckCircleIcon className="h-9 w-9 shrink-0 text-teal-400" />

              <h3 className="text-2xl font-semibold text-slate-600">
                Increase engagement
              </h3>
            </li>
          </ul>
        </div>
      </Element>

      <Element
        name="uploading"
        className="max-h-full min-h-9/10 w-screen bg-gradient-to-b from-slate-200 to-slate-400"
      >
        <div className="flex flex-col items-center justify-start">
          <h2 className="mb-10 bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text pr-1 text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
            Upload your video
          </h2>

          <FileInput
            onFile={(file: File) => {
              setFile(file);
            }}
            disabled={processingVideo || uploading}
          />

          <div className="mt-10 flex items-center justify-center">
            <TextButton
              onClick={async () => {
                await handleFileUpload();
                scrollToSection("output");
              }}
              text={"Submit"}
              disabled={!file || processingVideo || uploading}
            />
          </div>

          {gettingToken && (
            <div style={{ position: "fixed", bottom: 0, right: 0 }}>
              <Turnstile
                className="mt-7"
                siteKey="0x4AAAAAAACiGkz1x1wcw2J9"
                scriptOptions={{ async: true, defer: true, appendTo: "head" }}
                onSuccess={(token: string) => {
                  setToken(token);

                  setTimeout(() => {
                    setGettingToken(false);
                  }, 1000);
                }}
                options={{
                  theme: "light",
                }}
              />
            </div>
          )}
        </div>
      </Element>

      {(processingVideo || uploading || processedVideo) && (
        <Element
          name="output"
          className="flex max-h-full min-h-9/10 w-screen flex-col items-center justify-between bg-gradient-to-b from-slate-400 to-slate-600 py-5"
        >
          {(uploading || processingVideo) && (
            <>
              <h2 className="bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
                Your video is being processed.
              </h2>

              <div className="loader h-56 w-56" />
              <h3 className="text-md linear-wipe mb-8 px-4 ">
                This may take a few minutes. Please do not close the window or
                navigate away from this page.
              </h3>
            </>
          )}

          {processedVideo && (
            <>
              <h2 className="bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
                Your video has been processed.
              </h2>
              <video
                playsInline
                className="h-80 w-80 bg-slate-800"
                style={{ backgroundSize: `contain` }}
                src={processedVideo}
                controls
              />

              <div className="my-4">
                <TextButton
                  onClick={() => {
                    downloadVideo(processedVideo, "captioned-video.mp4");
                  }}
                  text={"Download"}
                />
              </div>
            </>
          )}
        </Element>
      )}
    </div>
  );
};

export default LandingPage;
