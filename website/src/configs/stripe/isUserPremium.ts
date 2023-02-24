import { auth } from "../firebase/firebaseConfig";
import { getIdToken, getIdTokenResult } from "firebase/auth";

export default async function isUserPremium(): Promise<string> {
  await getIdToken(auth.currentUser!, true);
  const decodedToken = await getIdTokenResult(auth.currentUser!);

  console.log(decodedToken.claims.stripeRole);

  // Return the type of role the user has
  if (decodedToken.claims.stripeRole == "premium") {
    return "Premium";
  } else if ((decodedToken.claims.stripeRole = "business100")) {
    return "Business100";
  } else if ((decodedToken.claims.stripeRole = "business300")) {
    return "Business300";
  } else {
    return "NotPremium";
  }
}
