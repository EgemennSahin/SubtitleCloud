import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "@/config/firebase-admin";
import { createPath } from "@/helpers/firebase";
import { getUidFromReqRes } from "@/helpers/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { folder, video_id } = req.body;

  const uid = await getUidFromReqRes(req, res);

  if (!uid) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const path = createPath(folder, uid, video_id);
    const file = firebaseAdmin.storage().bucket("shortzoo-premium").file(path);
    const [fileExists] = await file.exists();

    if (!fileExists) {
      return res.status(404).send(`File ${video_id} not found.`);
    }

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // Link expires in 15 minutes
    });

    return res.status(200).json({ url: signedUrl });
  } catch (error) {
    return res.status(500).send(`Error retrieving file ${video_id}: ${error}`);
  }
}
