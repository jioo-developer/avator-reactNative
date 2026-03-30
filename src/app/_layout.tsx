import queryClient from "@/api/queryClient";
import useAuth from "@/hooks/queries/useAuth";
import {
  SpaceMono_400Regular,
  useFonts,
} from "@expo-google-fonts/space-mono";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: SpaceMono_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
      <Toast />
    </QueryClientProvider>
  );
}

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth.id) return;
    Toast.show({
      type: "success",
      text1: `${auth.nickname}님 환영합니다.`,
    });
  }, [auth.id])
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}