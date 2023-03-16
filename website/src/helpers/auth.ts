import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onIdTokenChanged,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { destroyCookie, setCookie } from "nookies";
import { useEffect } from "react";

export function isValidInput(input: string, type: "email" | "password") {
  let regex = new RegExp("");

  switch (type) {
    case "email":
      regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      break;
    case "password":
      regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
      break;
  }
  return regex.test(input);
}

export const signUp = async (email: string, password: string) => {
  if (!isValidInput(email, "email")) {
    throw new Error("Invalid email");
  }

  if (!isValidInput(password, "password")) {
    throw new Error("Invalid password");
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    throw new Error("Error signing up");
  }
};

export const logIn = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    throw new Error("Email or password is incorrect");
  }
};

export const authGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);

    return true;
  } catch (error: any) {
    console.log(error);
  }
};

export const logOut = async () => {
  await signOut(auth);
};

export const setCookies = async (user: User | null, force?: boolean) => {
  if (!user) {
    // Destroy the cookie without using an api
    destroyCookie(null, "session", { path: "/" });
    return;
  }

  const token = await user.getIdToken(force);
  // Fetch API to set the cookie
  const cookie = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  // Save the account from being deleted
  await fetch("/api/save-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid: user.uid }),
  });

  // Set the cookie
  const { sessionCookie } = await cookie.json();

  setCookie(null, "session", sessionCookie, {
    maxAge: 60 * 60 * 24 * 14, // Expires in 2 weeks
    path: "/",
  });

  return;
};

export const useIdTokenListener = () => {
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      await setCookies(user);
    });
  }, []);
};
