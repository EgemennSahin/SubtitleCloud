export async function handleVideoProcessing(
  uploadedVideo: string,
  secondaryVideo: string,
  uid: string
) {
  if (!uploadedVideo || !uid) {
    return;
  }

  try {
    const endpoint =
      "https://public-process-api-gateway-6dipdkfs.uc.gateway.dev/process?key=AIzaSyA8gNrXERBjLwY8MlAGNYawoQgfzbhdRYY";

    const response = await fetch(endpoint, {
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
    });

    return await response.json();
  } catch (error: any) {
    console.log("Error processing video: ", error.message);
  }
}

export async function handleTranscribe(
  uid: string,
  videoId: string,
  captchaToken: string
) {
  if (!videoId || !uid || !captchaToken) {
    return;
  }

  console.log("Starting video processing...");

  try {
    const endpoint =
      "https://public-process-api-gateway-6dipdkfs.uc.gateway.dev/subtitle?key=AIzaSyA8gNrXERBjLwY8MlAGNYawoQgfzbhdRYY";

    // Get the subtitle from the video
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
        video_id: videoId,
        token: captchaToken,
      }),
    });

    const subtitle = await response.json();
    const downloadUrl = subtitle.download_url;
    const uploadUrl = subtitle.upload_url;

    return { downloadUrl, uploadUrl };
  } catch (error: any) {
    console.log("Error processing video: ", error.message);
  }
}
