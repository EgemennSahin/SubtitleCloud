import { firebaseAdmin } from "@/config/firebase-admin";
import { getUidFromReqRes } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the user's status is delete, and if so, delete that field
    const userDoc = await firebaseAdmin
      .firestore()
      .collection("users")
      .doc(uid)
      .get();

    if (!userDoc.exists) {
      return res.status(200).json({ message: "User document doesn't exist" });
    }

    const userDocData = userDoc.data();

    if (userDocData?.status != "delete") {
      return res
        .status(200)
        .json({ message: "User doesn't need to be deleted" });
    }

    await firebaseAdmin.firestore().collection("users").doc(uid).set(
      {
        status: firebaseAdmin.firestore.FieldValue.delete(),
      },
      { merge: true }
    );

    return res.status(200).json({ message: "User document saved" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
