import { router, useFocusEffect } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyScreen() {
  useFocusEffect(() => {
    // 화면이 활성화될 때마다 /auth로 강제 이동시키는 리다이렉트 로직
    router.replace("/auth");
  })
  return (
    <SafeAreaView>
      <Text>내정보 스크린</Text>
    </SafeAreaView>
  );
}
