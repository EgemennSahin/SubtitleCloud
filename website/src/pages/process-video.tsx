import FileInput from "@/components/FileInput";
import React, { useEffect } from "react";
import TextButton from "@/components/TextButton";
import {
  getMetadata,
  ref,
  StorageError,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { tempStorage } from "@/configs/firebase/firebaseConfig";
import { uuidv4 } from "@firebase/util";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/router";

const ProcessVideo = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedVideo, setUploadedVideo] = React.useState<string | null>();
  const [processingVideo, setProcessingVideo] = React.useState(false);
  const [processedVideo, setProcessedVideo] = React.useState<string | null>();

  const [token, setToken] = React.useState<string | null>();
  const [gettingToken, setGettingToken] = React.useState(false);
  const router = useRouter();

  // Process video if it is uploaded and token is received
  useEffect(() => {
    if (uploadedVideo != null && token != null) {
      handleVideoProcessing();
    }
  }, [uploadedVideo, token]);

  // Redirect to video page if video is processed
  useEffect(() => {
    if (processedVideo != null) {
      console.log("Redirecting to video page: ", processedVideo);

      router.push({
        pathname: `/content/${uploadedVideo}`,
        query: { video_url: processedVideo },
      });
    }
  }, [processedVideo]);

  // Process video
  async function handleVideoProcessing() {
    if (!uploadedVideo || !token) {
      console.log("Wrong parameters");
      return;
    }

    console.log("Starting video processing...");

    // Check if video is uploaded to the google cloud storage bucket
    const videoRef = ref(tempStorage, "uploads/" + uploadedVideo);

    const videoExists = await getMetadata(videoRef);

    if (!videoExists) {
      console.log("Error getting video");
      return;
    }

    try {
      setProcessingVideo(true);

      const response_video_processing = await fetch(
        "https://public-process-api-gateway-6dipdkfs.uc.gateway.dev/subtitle?key=AIzaSyA8gNrXERBjLwY8MlAGNYawoQgfzbhdRYY",
        {
          method: "POST",
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
    } catch (error: any) {
      console.log("Error processing video: ", error.message);

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

      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          return;
        }
        setGettingToken(true);

        const uid = uuidv4();
        const storageRef = ref(tempStorage, "uploads/" + uid);
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
            console.log("Upload complete");
            setUploadedVideo(uid);
            setProcessingVideo(true);
            setUploading(false);
            return;
          }
        );
      };
    }
  }

  return (
    <div className="flex max-h-fit min-h-screen flex-col items-center justify-start bg-gradient-to-b from-slate-200 to-slate-400 py-5 sm:py-9">
      {processingVideo || uploading ? (
        <div className="flex h-fit w-fit flex-col items-center justify-start px-5">
          <h2 className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
            Your video is being processed.
          </h2>

          <div className="loader mb-12 h-40 w-40" />
          <h3 className="text-md linear-wipe mb-8 px-4 text-center sm:hidden ">
            This may take a few minutes. Please do not close the window or
            navigate away from this page.
          </h3>

          <h3 className="text-md linear-wipe mb-8 hidden px-4 text-center sm:block ">
            This may take a few minutes.
          </h3>
        </div>
      ) : (
        <div className="max-w-screen flex h-screen min-w-fit flex-col items-center justify-start px-5 sm:h-full">
          <h2 className="my-10 bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text pr-1 text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
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
              size="medium"
              onClick={async () => {
                await handleFileUpload();
              }}
              text={"Submit"}
              disabled={!file || processingVideo || uploading}
            />
          </div>
        </div>
      )}

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
              size: "compact",
              theme: "light",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProcessVideo;
