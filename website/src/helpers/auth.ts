import { db, auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onIdTokenChanged,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import nookies from "nookies";

export const signUp = async (email: string, password: string) => {
  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(db, "users", userCredentials.user.uid), {
    email: userCredentials.user.email,
  });
};

export const logIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const authGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredentials = await signInWithPopup(auth, provider);

  console.log("userCredentials", userCredentials);
  const userExists = (
    await getDoc(doc(db, "users", userCredentials.user.uid))
  ).exists();

  console.log(userExists);
  if (!userExists) {
    await setDoc(doc(db, "users", userCredentials.user.uid), {
      email: userCredentials.user.email,
    });
  }
};

export const logOut = async () => {
  await signOut(auth);
};

export const idTokenListener = () => {
  const tokenName = "firebasetoken";

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (!user) {
        nookies.set(undefined, tokenName, "", { path: "/" });
      } else {
        const token = await user.getIdToken();
        nookies.set(undefined, tokenName, token, { path: "/" });
      }
    });
  }, []);
};
