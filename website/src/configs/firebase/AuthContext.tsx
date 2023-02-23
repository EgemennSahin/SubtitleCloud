import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  signInAnonymously,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/configs/firebase/firebaseConfig";

const AuthContext = createContext<{
  user: User | null;
  logIn: (email: string, password: string) => Promise<any>;
  authGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
}>(
  {} as {
    user: null;
    logIn: (email: string, password: string) => Promise<any>;
    authGoogle: () => Promise<void>;
    signUp: (email: string, password: string) => Promise<any>;
    logOut: () => Promise<void>;
  }
);

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", userCredentials.user.uid), {
      email: userCredentials.user.email,
    });
  };

  const anonymousSignIn = async () => {
    await signInAnonymously(auth);
  };

  const logIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const authGoogle = async () => {
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

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logIn, authGoogle, signUp, logOut }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}
