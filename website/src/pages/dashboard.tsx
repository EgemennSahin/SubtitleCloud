import ProgressBar from "@/components/ProgressBar";
import { storageUploads } from "@/configs/firebase/firebaseConfig";
import { useAuth } from "@/configs/firebase/AuthContext";
import {
  getDownloadURL,
  ref,
  StorageError,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import Link from "next/link";
import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import usePremiumStatus from "@/configs/stripe/usePremiumStatus";
import { createCheckoutSession } from "@/configs/stripe/createCheckoutSession";
import { uuidv4 } from "@firebase/util";
import { Turnstile } from "@marsidev/react-turnstile";

export default function DashboardPage() {
  const { user } = useAuth();
  const userIsPremium = usePremiumStatus(user);

  const [processedVideo, setProcessedVideo] = useState<string | null>();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [token, setToken] = useState<string>();

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
        const storageRef = ref(
          storageUploads,
          "videos/" + user?.uid + "/uploads/" + uid
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot: UploadTaskSnapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
            console.log("Upload progress: " + progress + "%");
          },
          (error: StorageError) => {
            console.log("Error uploading file: " + error.message);
          },
          async () => {
            // Video processing
            setProcessedVideo(null);

            console.log("Processing video");

            if (!user) {
              console.log("User not logged in");
              return;
            }

            if (!userIsPremium) {
              console.log("User is not premium");
              return;
            }

            const response_video_processing = await fetch(
              "https://private-process-video-px2m4mdiyq-uc.a.run.app",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  video_id: uid,
                  user_id: user.uid,
                  token: token,
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

  // Change user.email to user.displayName
  return (
    <>
      <div className="flex h-screen flex-col items-center gap-7">
        <div>
          {user && (
            <div className="flex flex-col items-center gap-7">
              Hello, {user.displayName}
              {userIsPremium == null ? (
                <div>Loading...</div>
              ) : !userIsPremium ? (
                <button
                  className="rounded-lg bg-blue-600 py-4 px-8 text-white"
                  onClick={() => createCheckoutSession(user.uid)}
                >
                  Upgrade to Premium
                </button>
              ) : (
                <div>You are a premium user</div>
              )}
            </div>
          )}
        </div>
        <label className="relative rounded-lg bg-blue-600 py-6 px-20 transition duration-200 hover:bg-blue-800">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="h-10 w-10 opacity-0"
            disabled={!userIsPremium}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
            Choose Video
          </div>
        </label>
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

        {processing && <ProgressBar progress={progress} />}

        <Link
          className="relative h-10 rounded-lg bg-blue-600 py-6 px-20 transition duration-200 hover:bg-blue-800"
          href="/uploadedVideos"
          passHref
        >
          <div className="absolute inset-0 flex items-center justify-center  text-xl font-bold text-white">
            Uploaded Videos
          </div>
        </Link>

        <Link
          className="relative h-10 rounded-lg bg-blue-600 py-6 px-20 transition duration-200 hover:bg-blue-800"
          href="/outputVideos"
          passHref
        >
          <div className="absolute  inset-0 flex items-center justify-center text-center text-xl font-bold text-white">
            Generated Videos
          </div>
        </Link>
      </div>
    </>
  );
}
