import { premiumStorage } from "@/config/firebase";
import { ref, getMetadata } from "firebase/storage";

export async function handleUpload(
  file: File | null,
  uid: string,
  folder: "main" | "side" | "audio"
) {
  if (!file) {
    console.log("No file selected");
    return;
  }

  try {
    const type = file.type;
    // Get the signed url from the server
    const response = await fetch("/api/upload-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, type, folder }),
    });

    const { url, file_id } = await response.json();

    // Upload to the signed url
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "Content-Length": file.size.toString(),
      },
      body: file,
    });

    return file_id;
  } catch (error: any) {
    console.log("Error uploading video: ", error.message);

    return null;
  }
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
