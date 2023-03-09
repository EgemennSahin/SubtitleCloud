import { firebaseAdmin } from "@/config/firebase-admin";
import { getToken } from "@/helpers/user";

import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const context: GetServerSidePropsContext = {
      req: req,
      res: res,
      query: {},
      resolvedUrl: "",
    };

    const decodedToken = await getToken({ context });

    console.log("Token:", decodedToken);

    // Check if the user is authenticated
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const uid = decodedToken.uid;

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
