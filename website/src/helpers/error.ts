import { setCookies } from "./auth";

export async function handleError(error: any) {
  console.log("Error:  ", error);

  if (error.code === "auth/id-token-expired") {
    // Get new token
    await setCookies(null, true);
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}
