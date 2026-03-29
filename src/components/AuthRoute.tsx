import React, { ReactNode, useCallback } from "react";
import useAuth from "@/hooks/queries/useAuth";
import { router, useFocusEffect } from "expo-router";

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
