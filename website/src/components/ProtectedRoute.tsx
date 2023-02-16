import { useAuth } from "@/configs/firebase/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/logIn");
    }
  }, [user, router]);

  return <>{user && children}</>;
};

export default ProtectedRoute;
