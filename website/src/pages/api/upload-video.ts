import { NextApiRequest, NextApiResponse } from "next";
import { Storage } from "@google-cloud/storage";
import { firebaseAdmin } from "@/config/firebase-admin";
import { uuidv4 } from "@firebase/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
  const { uid, type } = req.body;

  let contentType = "";
  let maxContentLength = 0;
  switch (type) {
    case "main" || "side":
      contentType = "video/mp4";
      maxContentLength = 100 * 1024 * 1024; // 100 MB
      break;
    case "audio":
      contentType = "audio/mpeg";
      maxContentLength = 10 * 1024 * 1024; // 10 MB
      break;
    default:
      return res.status(400).json({ message: "Invalid file type" });
  }

  // Create a unique id for the video
  const videoId = uuidv4();
  const filename = `${uid}/${type}/${videoId}`;
  const options = {
    version: "v4" as const,
    action: "write" as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: contentType,
    contentLength: maxContentLength,
  };

  try {
    const [url] = await firebaseAdmin
      .storage()
      .bucket("shortzoo-premium")
      .file(filename)
      .getSignedUrl(options);

    res.status(200).json({ url });
  } catch (err) {
    console.error(err);

    res.status(500).send("Internal server error");
  }
}
