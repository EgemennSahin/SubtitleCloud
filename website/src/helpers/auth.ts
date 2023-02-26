import { db, auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onIdTokenChanged,
  User,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import nookies from "nookies";

export function isValidEmail(email: string) {
  // Regular expression to validate email addresses
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

export function isValidPassword(password: string) {
  // Regular expression to validate email password
  const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
  return regex.test(password);
}

export const signUp = async (email: string, password: string) => {
  // If the email is not valid, throw an error
  if (!isValidEmail(email)) {
    throw new Error("Invalid email");
  } else if (!isValidPassword(password)) {
    throw new Error("Invalid password");
  }

  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", userCredentials.user.uid), {
      email: userCredentials.user.email,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error signing up");
  }
};

export const logIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const authGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredentials = await signInWithPopup(auth, provider);

    const userExists = (
      await getDoc(doc(db, "users", userCredentials.user.uid))
    ).exists();

    if (!userExists) {
      await setDoc(doc(db, "users", userCredentials.user.uid), {
        email: userCredentials.user.email,
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error signing up");
  }
};

export const logOut = async () => {
  await signOut(auth);
};

export const refreshUserToken = async () => {
  const user = auth.currentUser;
  if (user) {
    await user.getIdToken(true);
  }
};

export const setCookies = async (user: User | null) => {
  const tokenName = "firebasetoken";
  if (!user) {
    nookies.set(undefined, tokenName, "", { path: "/" });
  } else {
    const token = await user.getIdToken();
    nookies.set(undefined, tokenName, token, { path: "/" });
  }
  return;
};

export const useIdTokenListener = () => {
  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      setCookies(user);
    });
  }, []);
};
