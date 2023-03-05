import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  setCookie({ res }, "session", "", {
    maxAge: 0, // Expires in 2 weeks
    path: "/",
  });

  res.status(200).json({ message: "Logout successful" });
}
