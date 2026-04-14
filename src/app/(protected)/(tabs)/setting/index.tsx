import ListItem from "@/components/page/setting/ListItem";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { Entypo, Octicons } from "@expo/vector-icons";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const { logout } = useAuth();

  return (
    <SafeAreaView>
      <View style={styles.space} />
      <ListItem
        title="언어 설정"
        onPress={() => Alert.alert("준비 중 입니다.")}
        icon={<Entypo name="language" size={16} color={colors.BLACK} />}
      />
      <ListItem
        title="앱 버전 정보"
        onPress={() => Alert.alert("앱 버전 정보", "App Version 1.0")}
        icon={<Octicons name="info" size={16} color={colors.BLACK} />}
      />
      <ListItem
        title="로그아웃"
        onPress={logout}
        icon={<Octicons name="sign-out" size={16} color={colors.BLACK} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  space: {
    height: 10,
  },
});
