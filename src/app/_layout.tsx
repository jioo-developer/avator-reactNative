import queryClient from "@/api/config/queryClient";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: SpaceMono_400Regular,
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
    ...Octicons.font,
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
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="post" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}