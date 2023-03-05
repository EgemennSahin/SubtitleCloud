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
  await fetch("/api/logout", {
    method: "GET",
  });
  window.location.reload();
};

export const setCookies = async (user: User | null, force?: boolean) => {
  if (!user) {
    return;
  }

  const token = await user.getIdToken(force);
  // Fetch API to set the cookie
  await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  return;
};

export const useIdTokenListener = () => {
  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      await setCookies(user);
    });
  }, []);
};
