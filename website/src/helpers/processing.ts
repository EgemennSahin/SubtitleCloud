import { premiumStorage } from "@/config/firebase";
import { ref, getMetadata } from "firebase/storage";

export async function handleVideoProcessing(
  uploadedVideo: string,
  secondaryVideo: string,
  uid: string,
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
    // Get the subtitle from the video
    const response_subtitle = await fetch(
      "https://public-process-api-gateway-6dipdkfs.uc.gateway.dev/subtitle?key=AIzaSyA8gNrXERBjLwY8MlAGNYawoQgfzbhdRYY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          video_id: uploadedVideo,
          token: token,
        }),
      }
    );

    const subtitle = await response_subtitle.json();

    const downloadUrl = subtitle.download_url;
    const uploadUrl = subtitle.upload_url;

    console.log("Subtitle download url: ", downloadUrl);
    console.log("Subtitle upload url: ", uploadUrl);

    const response_process = await fetch(
      "https://public-process-api-gateway-6dipdkfs.uc.gateway.dev/process?key=AIzaSyA8gNrXERBjLwY8MlAGNYawoQgfzbhdRYY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          video_data: {
            video_id: uploadedVideo,
            secondary_id: secondaryVideo,
          },
        }),
      }
    );

    const data = await response_process.json();

    return data.url;
  } catch (error: any) {
    console.log("Error processing video: ", error.message);
  }
}
