import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { firebaseAdmin } from "@/config/firebase-admin";
import { uuidv4 } from "@firebase/util";
import { getToken } from "@/helpers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { folder, video_id } = req.body;

  const context: GetServerSidePropsContext = {
    req: req,
    res: res,
    query: {},
    resolvedUrl: "",
  };

  const decodedToken = await getToken({ context });

  // Check if the user is authenticated
  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const uid = decodedToken.uid;

  const filename = `${folder}/${uid}/${video_id}`;

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
