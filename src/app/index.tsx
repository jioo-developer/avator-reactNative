import useAuth from "@/hooks/queries/auth/useAuth";
import { Redirect } from "expo-router";

export default function Page() {
  const { auth, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  if (!auth.id) {
    return <Redirect href="/auth" />;
  }

  return <Redirect href="/(protected)/(tabs)/home" />;
}
