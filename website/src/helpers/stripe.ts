import { db } from "@/config/firebase";
import getStripe from "@/config/stripe";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import {
  collection,
  addDoc,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";

export async function createCheckoutSession(
  uid: string,
  plan: string,
  isMonthly: boolean
) {
  console.log("uid: ", uid);
  // Plan = "premium" or "business"
  // Term = "monthly" or "annually"
  const premium_monthly = "price_1MhbnlHRv5JZrE6uqyM0FJRp";
  const premium_annually = "price_1MhbnlHRv5JZrE6uV2dhY586";
  const business_monthly = "price_1MenrvHRv5JZrE6ulZKs6Ade";
  const business_annually = "price_1MhbPqHRv5JZrE6uDNzHWvPA";

  let priceId = "";

  switch (plan) {
    case "premium":
      if (isMonthly) {
        priceId = premium_monthly;
      } else {
        priceId = premium_annually;
      }
      break;
    case "business":
      if (isMonthly) {
        priceId = business_monthly;
      } else {
        priceId = business_annually;
      }
      break;
    default:
      if (isMonthly) {
        priceId = premium_monthly;
      } else {
        priceId = premium_annually;
      }
      break;
  }

  // Create a new checkout session in the subcollection inside the user document
  const checkoutSessionCollectionRef = collection(
    db,
    "users",
    uid,
    "checkout_sessions"
  );

  const checkoutSessionRef = await addDoc(checkoutSessionCollectionRef, {
    price: priceId,
    success_url: "https://www.shortzoo.com/verify-checkout",
    cancel_url: "https://www.shortzoo.com/premium",
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
  return token.stripeRole == "premium" || token.stripeRole == "business";
}

export async function handleCheckout({
  uid,
  selectedPlan,
  isMonthly,
}: {
  uid: string;
  selectedPlan: string;
  isMonthly: boolean;
}) {
  try {
    const sessionId = await createCheckoutSession(uid, selectedPlan, isMonthly);

    console.log("Redirecting to checkout");

    const stripe = await getStripe();
    stripe?.redirectToCheckout({
      sessionId,
    });
  } catch (error) {
    console.log(error);
  }
}
