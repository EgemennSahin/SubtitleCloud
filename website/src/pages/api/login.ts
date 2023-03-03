import { firebaseAdmin } from "@/config/firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { token } = req.body;

  try {
    const sessionCookie = await firebaseAdmin
      .auth()
      .createSessionCookie(token, { expiresIn: 60 * 60 * 24 * 7 }); // Expires in 1 week
    setCookie({ res }, "session", sessionCookie, {
      maxAge: 60 * 60 * 24 * 7, // Expires in 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid email or password" });
  }
}
