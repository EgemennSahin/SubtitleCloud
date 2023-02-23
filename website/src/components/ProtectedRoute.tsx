import { useAuth } from "@/configs/firebase/AuthContext";
import usePremiumStatus from "@/configs/stripe/usePremiumStatus";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const isPremium = usePremiumStatus(user);

  useEffect(() => {
    // If user is not logged in or not verified, redirect to login page
    if (!user) {
      router.push("/");
    } else if (!user.emailVerified) {
      router.push("/dashboard/onboarding");
    } else if (!isPremium) {
      router.push("/dashboard/premium");
    }
  }, [user, router]);

  return <>{user && children}</>;
};

export default ProtectedRoute;
