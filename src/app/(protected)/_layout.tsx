import AuthRoute from "@/components/AuthRoute";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <AuthRoute>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="post" />
        <Stack.Screen name="detail" />
      </Stack>
    </AuthRoute>
  );
}
