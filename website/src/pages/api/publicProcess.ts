import { NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
  video_id: string;
};

type ResponseData = {
  status: string;
  message: string;
  url: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { video_id } = req.body as RequestBody;

  if (!video_id) {
    res.status(400).json({
      status: "error",
      message: "Missing video_id",
      url: null,
    });
    return;
  }

  try {
    const response_video_processing = await fetch(
      "https://us-central1-captioning-693de.cloudfunctions.net/public_process_video",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: video_id,
        }),
      }
    );

    const data = await response_video_processing.json();

    res.status(200).json({
      status: "success",
      message: "Video ID: " + video_id,
      url: data.url,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
      url: null,
    });
  }
}
