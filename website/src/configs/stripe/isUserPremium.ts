import { auth } from "../firebase/firebaseConfig";
import { getIdToken, getIdTokenResult } from "firebase/auth";

export default async function isUserPremium(): Promise<boolean> {
  await getIdToken(auth.currentUser!, true);
  const decodedToken = await getIdTokenResult(auth.currentUser!);

  return decodedToken?.claims?.stripeRole ? true : false;
}
