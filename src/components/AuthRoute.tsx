import useAuth from "@/hooks/queries/auth/useAuth";
import { router, useFocusEffect } from "expo-router";
import React, { ReactNode, useCallback } from "react";

interface AuthRouteProps {
  children: ReactNode;
}

function AuthRoute({ children }: AuthRouteProps) {
  const { auth, isAuthLoading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!isAuthLoading && !auth.id) {
        router.replace("/auth");
      }
    }, [auth.id, isAuthLoading])
  );

  return <>{children}</>;
}

export default AuthRoute;
