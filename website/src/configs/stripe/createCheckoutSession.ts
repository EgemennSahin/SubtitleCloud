import getStripe from "@/configs/stripe/stripeConfig";
import { db } from "@/configs/firebase/firebaseConfig";
import {
  collection,
  setDoc,
  addDoc,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";

export async function createCheckoutSession(uid: string) {
  // Create a new checkout session in the subcollection inside the user document
  const checkoutSessionCollectionRef = collection(
    db,
    "users",
    uid,
    "checkout_sessions"
  );

  const checkoutSessionRef = await addDoc(checkoutSessionCollectionRef, {
    price: "price_1MZQF4HRv5JZrE6uYENUbmWD",
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(checkoutSessionRef, async (snap: DocumentData) => {
    const { sessionId } = snap.data();
    if (sessionId) {
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    }
  });
}
