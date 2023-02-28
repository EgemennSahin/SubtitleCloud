import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "@/config/firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid, folder, video_id } = req.body;

  console.log("uid: ", uid);
  console.log("folder: ", folder);
  console.log("video_id: ", video_id);

  try {
    const file = firebaseAdmin
      .storage()
      .bucket("shortzoo-premium")
      .file(`${uid}/${folder}/${video_id}`);
    const [fileExists] = await file.exists();

    if (!fileExists) {
      return res.status(404).send(`File ${video_id} not found.`);
    }

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // Link expires in 15 minutes
    });

    res.status(200).json({ url: signedUrl });
  } catch (error) {
    console.error("Error retrieving file: ", error);
    res.status(500).send(`Error retrieving file ${video_id}: ${error}`);
  }
}
