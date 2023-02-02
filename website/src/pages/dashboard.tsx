import ProgressBar from "@/components/ProgressBar";
import VideoList from "@/components/VideoList";
import { storage } from "@/configs/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDownloadURL,
  ref,
  StorageError,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { BaseSyntheticEvent, useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

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

    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime().toString();
    const storageRef = ref(
      storage,
      "videos/mp4/" + user?.uid + "/" + currentTimestamp
    );
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
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });

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
        <h1 className="font-normal text-2xl text-slate-600">
          {user?.email}'s Dashboard
        </h1>

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
          href="/videos"
          passHref
        >
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
            Videos
          </div>
        </Link>
      </div>
    </>
  );
}
