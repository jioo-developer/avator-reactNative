import ListItem from "@/components/_pageComponents/setting/ListItem";
import AuthRoute from "@/components/AuthRoute";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { Entypo, Octicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const { logout } = useAuth();

  return (
    <AuthRoute>
      <SafeAreaView>
        <View style={styles.space} />
        <ListItem
          title="언어 설정"
          icon={<Entypo name="language" size={16} color={colors.BLACK} />}
        />
        <View style={styles.space} />
        <ListItem
          title="로그아웃"
          onPress={logout}
          icon={<Octicons name="sign-out" size={16} color={colors.BLACK} />}
        />
      </SafeAreaView>
    </AuthRoute>
  );
}

const styles = StyleSheet.create({
  space: {
    height: 10,
  },
});
