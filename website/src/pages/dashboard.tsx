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

export default function DashboardPage() {
  const { user } = useAuth();
  const userIsPremium = usePremiumStatus(user);

  const [file, setFile] = useState<Blob | null>();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (file) {
      setUploading(false);
    }
  }, [file]);

  // Function to upload a pre-chosen file onto Firebase Storage when a form is submitted
  async function handleUpload(event: BaseSyntheticEvent) {
    event.preventDefault();
    if (uploading || !file) {
      console.log("Still loading. Wait");
      return;
    }

    setUploading(true);

    const uid = uuidv4();
    const storageRef = ref(storageUploads, "videos/" + user?.uid + "/" + uid);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error: StorageError) => {
        console.log(error.message);
      },
      async () => {
        console.log("Processing video");
        const response_video_processing = await fetch(
          "https://private-process-video-px2m4mdiyq-uc.a.run.app",
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
        setUploading(false);
        setFile(null);
        setProgress(0);
      }
    );
  }

  // Function to choose a file from the user's computer
  function handleChoose(event: BaseSyntheticEvent) {
    event.preventDefault();
    setUploading(true);
    setFile(event.target.files[0]);
  }

  // Change user.email to user.displayName
  return (
    <>
      <div className="flex flex-col items-center h-screen gap-7">
        <div>
          {user && (
            <div className="flex flex-col items-center gap-7">
              Hello, {user.displayName}
              {!userIsPremium ? (
                <button
                  className="bg-blue-600 text-white py-4 px-8 rounded-lg"
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
        <label className="relative rounded-lg py-6 px-20 bg-blue-600 hover:bg-blue-800 transition duration-200">
          <input
            type="file"
            accept="video/*"
            onChange={handleChoose}
            className="w-10 h-10 opacity-0"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
            Choose Video
          </div>
        </label>

        {file ? (
          <form
            className="h-10 relative rounded-lg py-6 px-20 bg-blue-600 hover:bg-blue-800 transition duration-200"
            onSubmit={handleUpload}
          >
            <button type="submit" disabled={file == null}>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                Upload
              </div>
            </button>
          </form>
        ) : (
          <form className="h-10 relative rounded-lg py-6 px-20 bg-slate-300 transition duration-200">
            <button type="submit" disabled={file == null}>
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold text-xl">
                Upload
              </div>
            </button>
          </form>
        )}

        {uploading ? (
          <div>
            <ProgressBar progress={progress} />
          </div>
        ) : (
          <></>
        )}

        <Link
          className="h-10 relative rounded-lg py-6 px-20 bg-blue-600 hover:bg-blue-800 transition duration-200"
          href="/uploadedVideos"
          passHref
        >
          <div className="absolute inset-0 flex items-center justify-center  text-white font-bold text-xl">
            Uploaded Videos
          </div>
        </Link>

        <Link
          className="h-10 relative rounded-lg py-6 px-20 bg-blue-600 hover:bg-blue-800 transition duration-200"
          href="/outputVideos"
          passHref
        >
          <div className="absolute  inset-0 flex items-center justify-center text-center text-white font-bold text-xl">
            Generated Videos
          </div>
        </Link>
      </div>
    </>
  );
}
function uuidv4() {
  throw new Error("Function not implemented.");
}
