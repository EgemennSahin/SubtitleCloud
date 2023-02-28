import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { firebaseAdmin } from "@/config/firebase-admin";
import { getToken, verifyToken } from "@/helpers/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { folder, id_token, video_id } = req.body;

  const decodedToken = await verifyToken(id_token);

  // Check if the user is authenticated
  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const uid = decodedToken.uid;

  console.log("UID: ", uid);
  try {
    const file = firebaseAdmin
      .storage()
      .bucket("shortzoo-premium")
      .file(`${folder}/${uid}/${video_id}`);
    const [fileExists] = await file.exists();

    if (!fileExists) {
      return res.status(404).send(`File ${video_id} not found.`);
    }

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // Link expires in 15 minutes
    });

    console.log("Url: ", signedUrl);

    res.status(200).json({ url: signedUrl });
  } catch (error) {
    console.error("Error retrieving file: ", error);
    res.status(500).send(`Error retrieving file ${video_id}: ${error}`);
  }
}
