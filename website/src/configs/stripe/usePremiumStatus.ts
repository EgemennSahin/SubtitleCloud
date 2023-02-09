import { useState, useEffect } from "react";
import isUserPremium from "./isUserPremium";
import { User } from "firebase/auth";

export default function usePremiumStatus(user: User | null) {
  const [premiumStatus, setPremiumStatus] = useState(false);

  useEffect(() => {
    if (user) {
      const checkPremiumStatus = async function () {
        setPremiumStatus(await isUserPremium());
      };
      checkPremiumStatus();
    }
  }, [user]);

  return premiumStatus;
}
