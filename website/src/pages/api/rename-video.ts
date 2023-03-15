import { firebaseAdmin } from "@/config/firebase-admin";
import { getUidFromReqRes } from "@/helpers/api";
import { createPath } from "@/helpers/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { video_id, folder, name } = req.body;

  if (!video_id || !name || !folder)
    return res.status(400).json({ message: "Bad request." });

  const uid = await getUidFromReqRes(req, res);

  if (!uid) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const path = createPath(folder, uid, video_id);
    const blob = firebaseAdmin.storage().bucket("shortzoo-premium").file(path);
    await blob.setMetadata({ metadata: { title: name } });
    return res
      .status(200)
      .json({ message: `Metadata for ${video_id} updated successfully.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update metadata." });
  }
}
