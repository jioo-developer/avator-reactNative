import useAuth from "@/hooks/queries/auth/useAuth";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const { logout } = useAuth();
  return (
    <SafeAreaView>
      <Pressable onPress={logout}>
        <Text>로그아웃</Text>
      </Pressable>
    </SafeAreaView>
  );
}
