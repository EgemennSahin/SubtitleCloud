import MyButton from "@/components/ProcessButton";
import { storageUploads } from "@/configs/firebase/firebaseConfig";
import {
  getDownloadURL,
  ref,
  StorageError,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import React, { BaseSyntheticEvent } from "react";

const IndexPage = () => {
  async function handleFileUpload(event: BaseSyntheticEvent) {
    event.preventDefault();

    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime().toString();
    const storageRef = ref(storageUploads, "videos/temp/" + currentTimestamp);
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
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // Send downloadURL to Cloud Function
          console.log("Invoking Cloud Function with video URL");

          const response = await fetch(
            "https://us-central1-captioning-693de.cloudfunctions.net/hello",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: downloadURL,
              }),
            }
          );

          const data = await response.json();

          console.log("Cloud function invoked: ", data);
        });
      }
    );
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
          Choose Video
        </div>
      </label>
    </>
  );
};

export default IndexPage;
