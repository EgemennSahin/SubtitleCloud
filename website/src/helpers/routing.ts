import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export function dashboardRoute(token: DecodedIdToken) {
  if (!token.email_verified) {
    return "/onboarding/verify-email";
  }

  if (!token.phone_number) {
    return "/onboarding/verify-phone";
  }

  return true;
}
