import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  destroyCookie({ res }, "session", {
    path: "/",
  });
  
  res.status(200).json({ message: "Logout successful" });
}
