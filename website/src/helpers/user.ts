import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAdmin } from "@/config/firebase-admin";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

export function getUser({ uid }: { uid: string }) {
  const docRef = doc(db, "users", uid);
  return getDoc(docRef);
}

export function getIdToken({
  context,
}: {
  context: GetServerSidePropsContext;
}) {
  const tokenName = "firebasetoken";
  const cookies = nookies.get(context);
  return firebaseAdmin.auth().verifyIdToken(cookies[tokenName]);
}
