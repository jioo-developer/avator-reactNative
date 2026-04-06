import useAuth from "@/hooks/queries/auth/useAuth";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const { logout } = useAuth();
  return (
    <SafeAreaView>
      <Pressable onPress={logout}>로그아웃</Pressable>
    </SafeAreaView>
  );
}
