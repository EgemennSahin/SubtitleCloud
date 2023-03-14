import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export function dashboardRoute(token: DecodedIdToken) {
  if (!token.email_verified) {
    return {
      redirect: {
        destination: "/onboarding/verify-email",
        permanent: false,
      },
    };
  }

  if (!token.phone_number) {
    return {
      redirect: {
        destination: "/onboarding/verify-phone",
        permanent: false,
      },
    };
  }
}
