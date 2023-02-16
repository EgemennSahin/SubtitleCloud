import { useState, useEffect } from "react";
import isUserPremium from "./isUserPremium";
import { User } from "firebase/auth";

export default function usePremiumStatus(user: User | null) {
  const [premiumStatus, setPremiumStatus] = useState<boolean | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPremiumStatus() {
      if (user) {
        const isPremium = await isUserPremium();
        setPremiumStatus(isPremium);
      }
      setLoading(false);
    }
    checkPremiumStatus();
  }, [user]);

  if (loading) {
    return null;
  }
  return premiumStatus;
}
