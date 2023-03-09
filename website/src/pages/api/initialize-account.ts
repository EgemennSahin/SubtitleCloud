import { firebaseAdmin } from "@/config/firebase-admin";
import { getToken } from "@/helpers/user";
import moment from "moment";
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

    const user = await firebaseAdmin.auth().getUser(decodedToken.uid);

    // Check if the phone number is provided
    if (!user.phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Add the phone number to the user document

    const uid = decodedToken.uid;

    const userDoc = await firebaseAdmin
      .firestore()
      .collection("users")
      .doc(uid)
      .get();

    if (userDoc.exists) {
      return res.status(200).json({ message: "User document already exists" });
    }

    const signupDate = new Date();
    let weekOfMonth =
      moment(signupDate).week() -
      moment(signupDate).startOf("month").week() +
      1;

    if (weekOfMonth > 4) {
      weekOfMonth = 4;
    }

    await firebaseAdmin.firestore().collection("users").doc(uid).set({
      uid,
      video_credit: 15,
      signup_week: weekOfMonth,
    });

    res.status(200).json({ message: "User document initialized" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
