import { NextApiRequest, NextApiResponse } from "next";

export default async function getStripeRole(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { decodedToken } = req.body;

  try {
    // Decode the user's ID token to get the Stripe role claim
    const stripeRole = decodedToken.claims.stripeRole;

    res.status(200).json({ stripeRole });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Stripe role");
  }
}
