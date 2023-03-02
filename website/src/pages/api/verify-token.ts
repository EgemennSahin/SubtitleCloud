import { NextApiRequest, NextApiResponse } from "next";

const endpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const secret = process.env.CAPTCHA_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = `secret=${encodeURIComponent(
    secret
  )}&response=${encodeURIComponent(req.body.token)}`;

  const result = await fetch(endpoint, {
    method: "POST",
    body,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  const data = await result.json();

  if (data.success) {
    return res.status(200).json({
      fetch:
        "https://public-process-api-gateway-6dipdkfs.uc.gateway.dev/subtitle?key=AIzaSyA8gNrXERBjLwY8MlAGNYawoQgfzbhdRYY",
    });
  } else {
    return res.status(400).json({ message: "Invalid captcha token" });
  }
}
