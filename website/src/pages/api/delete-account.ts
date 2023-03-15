import { firebaseAdmin } from "@/config/firebase-admin";
import { getUidFromReqRes } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const uid = await getUidFromReqRes(req, res);

    if (!uid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await firebaseAdmin.firestore().collection("users").doc(uid).set(
      {
        status: "delete",
      },
      { merge: true }
    );

    res.status(200).json({ message: "User document initialized" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
