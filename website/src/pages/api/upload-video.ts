import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "@/config/firebase-admin";
import { uuidv4 } from "@firebase/util";
import { getToken } from "@/helpers/user";
import { parseCookies } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type, folder } = req.body;

  const uid = parseCookies({ req })["firebasetoken"];

  // Check if the user is authenticated
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let maxContentLength = 0;
  switch (folder) {
    case "main" || "side":
      // Check if type starts with "video"
      if (!type.startsWith("video")) {
        return res.status(400).json({ message: "Invalid file type" });
      }
      maxContentLength = 100 * 1024 * 1024; // 100 MB
      break;
    case "audio":
      if (!type.startsWith("audio")) {
        return res.status(400).json({ message: "Invalid file type" });
      }
      maxContentLength = 10 * 1024 * 1024; // 10 MB
      break;
    default:
      return res.status(400).json({ message: "Invalid file type" });
  }

  // Create a unique id for the file
  const file_id = uuidv4();
  const filename = `${folder}/${uid}/${file_id}`;
  const options = {
    version: "v4" as const,
    action: "write" as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: type,
    contentLength: maxContentLength,
  };

  try {
    const [url] = await firebaseAdmin
      .storage()
      .bucket("shortzoo-premium")
      .file(filename)
      .getSignedUrl(options);

    res.status(200).json({ url, file_id });
  } catch (err) {
    console.error(err);

    res.status(500).send("Internal server error");
  }
}
