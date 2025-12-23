import { useAuth } from "@/features/auth/model/hooks/useAuth";
import { useEffect, useRef } from "react";


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const isInit = useRef(true);

  console.log(user);
  

  useEffect(() => {
    isInit.current = false;
  }, []);

  if (!user && !isLoading && isInit) {
    return null;
  }

  return children;
};
