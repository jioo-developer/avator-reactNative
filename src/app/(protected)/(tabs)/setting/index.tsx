import useAuth from "@/hooks/queries/auth/useAuth";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const { logout } = useAuth();
  return (
    <SafeAreaView>
      <Text onPress={logout}>로그아웃</Text>
    </SafeAreaView>
  );
}
