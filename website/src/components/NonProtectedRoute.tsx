import { useAuth } from "@/configs/firebase/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const NonProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [router, user]);

  return <>{!user ? children : null}</>;
};

export default NonProtectedRoute;
