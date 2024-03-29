import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  setCookie({ res }, "session", "", {
    maxAge: 0,
    path: "/",
  });

  return res.status(200).json({ message: "Logout successful" });
}
