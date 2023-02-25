import { auth } from "@/config/firebase";
import { setCookies } from "./auth";

export function handleError(error: any) {
  console.log("Error:  ", error);

  if (error.code === "auth/id-token-expired") {
    // Get new token
    setCookies(auth.currentUser);
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}
