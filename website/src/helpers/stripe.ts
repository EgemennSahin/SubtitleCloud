import { db } from "@/config/firebase";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import {
  collection,
  addDoc,
  DocumentData,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

export async function createCheckoutSession(
  uid: string,
  plan: string,
  annually: boolean
) {
  // Create a new checkout session in the subcollection inside the user document
  const checkoutSessionCollectionRef = collection(
    db,
    "users",
    uid,
    "checkout_sessions"
  );

  // Plan = "premium" or "business"
  // Term = "monthly" or "annually"
  const premium_monthly = "price_1MenijHRv5JZrE6u5gv4cYKm";
  const premium_annually = "price_1MenijHRv5JZrE6u5gv4cYKm";
  const business_100_monthly = "price_1MenrvHRv5JZrE6ulZKs6Ade";
  const business_100_annually = "price_1MenrvHRv5JZrE6uW1l8H7QF";
  const business_300_monthly = "price_1MeooeHRv5JZrE6uGBGaQziE";
  const business_300_annually = "price_1MeooeHRv5JZrE6usNosLdF0";

  let priceId = "";

  switch (plan) {
    case "premium":
      if (annually) {
        priceId = premium_annually;
      } else {
        priceId = premium_monthly;
      }
      break;
    case "business_100":
      if (annually) {
        priceId = business_100_annually;
      } else {
        priceId = business_100_monthly;
      }
      break;
    case "business_300":
      if (annually) {
        priceId = business_300_annually;
      } else {
        priceId = business_300_monthly;
      }
      break;
    default:
      break;
  }

  const checkoutSessionRef = await addDoc(checkoutSessionCollectionRef, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  return new Promise<string>((resolve, reject) => {
    // Wait for the CheckoutSession to get attached by the extension
    onSnapshot(
      checkoutSessionRef,
      async (snap: DocumentData) => {
        const { sessionId } = snap.data();
        if (sessionId) {
          resolve(sessionId);
        }
      },
      reject
    );
  });
}

export function isPaidUser({ token }: { token: DecodedIdToken }) {
  return (
    token.stripeRole == "premium" ||
    token.stripeRole == "business100" ||
    token.stripeRole == "business300"
  );
}
