import { firebaseAdmin } from "@/config/firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token } = req.body;

  try {
    const sessionCookie = await firebaseAdmin
      .auth()
      .createSessionCookie(token, { expiresIn: 60 * 60 * 24 * 14 * 1000 }); // Expires in 2 weeks

    return res
      .status(200)
      .json({ sessionCookie: sessionCookie, message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid email or password" });
  }
}
