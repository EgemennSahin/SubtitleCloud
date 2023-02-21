import { useAuth } from "@/configs/firebase/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in or not verified, redirect to login page
    if (!user) {
      router.push("/logIn");
    } else if (!user.emailVerified) {
      router.push("/dashboard/verifyEmail");
    }
  }, [user, router]);

  return <>{user && children}</>;
};

export default ProtectedRoute;
