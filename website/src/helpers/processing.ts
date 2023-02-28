import { premiumStorage } from "@/config/firebase";
import { ref, getMetadata } from "firebase/storage";

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
