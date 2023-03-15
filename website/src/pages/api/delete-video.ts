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

  const filename = createPath(folder, uid, video_id);

  try {
    await firebaseAdmin
      .storage()
      .bucket("shortzoo-premium")
      .file(filename)
      .delete();

    res.status(200).send("Success");
  } catch (err) {
    console.error("Error: ", err);

    res.status(500).send("Internal server error");
  }
}
