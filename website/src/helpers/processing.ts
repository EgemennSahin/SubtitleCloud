import { premiumStorage, tempStorage } from "@/config/firebase";
import {
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
  StorageError,
  getMetadata,
} from "firebase/storage";
import { uuidv4 } from "@firebase/util";

export async function handleFileUpload(
  file: File,
  uid: string,
  type: "main" | "side" | "audio"
) {
  if (!file) {
    return;
  }

  if (type == "audio") {
    // Check if file is less than 10MB
    if (file.size > 1024 * 1024 * 10) {
      return;
    }
  }

  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = URL.createObjectURL(file);

  video.onloadedmetadata = function () {
    window.URL.revokeObjectURL(video.src);
    if (video.duration > 180) {
      return;
    }

    // Create a unique ID for the video
    const videoId = uuidv4();
    const bucketPath = "uploads/" + uid + "/" + type + "/" + videoId;
    const storageRef = ref(premiumStorage, bucketPath);
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
        console.log("Upload complete");
        return bucketPath;
      }
    );
  };
}

export async function handleVideoProcessing(
  uploadedVideo: string,
  token: string
) {
  if (!uploadedVideo || !token) {
    return;
  }

  console.log("Starting video processing...");

  // Check if video is uploaded to the google cloud storage bucket
  const videoRef = ref(premiumStorage, "uploads/" + uploadedVideo);
  const videoExists = await getMetadata(videoRef);

  if (!videoExists) {
    console.log("Error getting video");
    return;
  }

  try {
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

    return data.url;
  } catch (error: any) {
    console.log("Error processing video: ", error.message);
  }
}
