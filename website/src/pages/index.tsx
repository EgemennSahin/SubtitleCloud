import { tempStorage } from "@/configs/firebase/firebaseConfig";
import {
  ref,
  StorageError,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import { uuidv4 } from "@firebase/util";

const IndexPage = () => {
  const [processedVideo, setProcessedVideo] = useState<string | null>();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (processedVideo) {
      setProcessing(false);
    }
  }, [processedVideo]);

  useEffect(() => {
    if (processing) {
      setProcessedVideo(null);
    }
  }, [processing]);

  async function handleFileUpload(event: BaseSyntheticEvent) {
    event.preventDefault();

    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    } else {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        console.log("Duration: ", duration);
        if (duration > 60) {
          console.log("Video too long");
          return;
        }

        console.log("Video is good");

        setProcessing(true);

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
          },
          async () => {
            // Video processing
            setProcessedVideo(null);

            console.log("Processing video");

            const response_video_processing = await fetch(
              "https://us-central1-captioning-693de.cloudfunctions.net/public_process_video",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  video_id: uid,
                }),
              }
            );

            const data = await response_video_processing.json();

            console.log("Cloud function invoked: ", data);

            setProcessedVideo(data.url);
            setProcessing(false);
          }
        );
      };
      video.src = URL.createObjectURL(file);
    }
  }

  return (
    <>
      <label className="relative rounded-lg py-6 px-20 bg-blue-600 hover:bg-blue-800 transition duration-200">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="w-10 h-10 opacity-0"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
          Upload Video
        </div>
      </label>

      {processing && (
        <div className="flex items-center justify-center h-64">
          <div className="text-2xl font-bold text-gray-600">
            Stay on this page. Processing...
          </div>
        </div>
      )}

      {processedVideo && (
        <video
          className="w-full h-64 bg-slate-800"
          style={{ backgroundSize: `contain` }}
          src={processedVideo}
          controls
        />
      )}
    </>
  );
};

export default IndexPage;
