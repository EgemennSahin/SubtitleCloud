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

  const scrollToSection = (documentId: string) => {
    scroller.scrollTo(documentId, {
      duration: 700,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -120,
    });
  };

  useEffect(() => {
    if (uploadedVideo && token != null) {
      handleVideoProcessing();
    }
  }, [uploadedVideo, token]);

  async function handleVideoProcessing() {
    setProcessingVideo(true);

    if (!token) {
      console.log("No token");
      return;
    }

    const response_video_processing = await fetch(
      "https://us-central1-captioning-693de.cloudfunctions.net/public_process_video",
      {
        method: "POST",
        mode: "no-cors",
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
    setProcessingVideo(false);
    console.log("Cloud function invoked: ", data);

    setProcessingVideo(false);

    if (data.url) {
      setProcessedVideo(data.url);
      return true;
    } else {
      setProcessedVideo(null);
      return false;
    }
  }

  async function handleFileUpload() {
    if (!file) {
      console.log("No file selected");
      return;
    } else {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        console.log("Duration: ", duration);
        if (duration > 60) {
          console.log("Video too long");
          return;
        }

        console.log("Video is good");

        const uid = uuidv4();
        const storageRef = ref(tempStorage, uid);
        const uploadTask = uploadBytesResumable(storageRef, file);
        setUploading(true);

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
          },
          () => {
            setUploadedVideo(uid);
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
            onFile={async (file: File) => {
              setFile(file);
            }}
          />

          <Turnstile
            siteKey="0x4AAAAAAACiGkz1x1wcw2J9"
            scriptOptions={{ async: true, defer: true, appendTo: "head" }}
            onSuccess={(token: string) => {
              setToken(token);
              console.log(token);
            }}
            options={{
              theme: "dark",
              size: "invisible",
            }}
          />

          <div className="mt-10 flex items-center justify-center">
            <TextButton
              onClick={async () => {
                // TODO: Upload file
                scrollToSection("processing");

                await handleFileUpload();
              }}
              text={"Submit"}
              disabled={!file && !processingVideo}
            />
          </div>
        </div>
      </Element>

      <Element
        name="processing"
        className="max-h-full min-h-screen w-screen bg-gradient-to-b from-slate-400 to-slate-600"
      >
        <div className="mb-10 flex items-center justify-center">
          {processedVideo && (
            <video
              className="h-64 w-full bg-slate-800"
              style={{ backgroundSize: `contain` }}
              src={processedVideo}
              controls
            />
          )}
        </div>
      </Element>

      <Element
        name="output"
        className="max-h-full min-h-screen w-screen bg-gradient-to-b from-slate-600 to-slate-800"
      ></Element>
    </div>
  );
};

export default LandingPage;
