import { User } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
  video_id: string;
  user: User;
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
  const { video_id, user } = req.body as RequestBody;

  // Check if user is logged in
  if (!user) {
    res.status(400).json({
      status: "error",
      message: "Missing user",
      url: null,
    });
    return;
  }

  // Check if video_id is provided
  if (!video_id) {
    res.status(400).json({
      status: "error",
      message: "Missing video_id",
      url: null,
    });
    return;
  }

  try {
    console.log("video_id: " + video_id);
    const response_video_processing = await fetch(
      "https://private-process-video-px2m4mdiyq-uc.a.run.app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: video_id,
          user_id: user.uid,
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
