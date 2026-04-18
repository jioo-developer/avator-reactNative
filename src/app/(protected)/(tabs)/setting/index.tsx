import ListItem from "@/components/page/setting/ListItem";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { Feather, Octicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const { logout, deleteAccountMutation: deleteAccount } = useAuth();

  const onDeleteAccount = () => {
    Alert.alert(
      "계정 삭제",
      "계정과 관련된 데이터가 모두 삭제됩니다. 계속하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            deleteAccount.mutate();
          }
        },
      ],
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.space} />
      <ListItem
        title="앱 버전 정보"
        onPress={() => router.push("/setting/version" as Href)}
        icon={<Feather name="info" size={16} color={colors.BLACK} />}
      />
      <ListItem
        title="로그아웃"
        onPress={logout}
        icon={<Octicons name="sign-out" size={16} color={colors.BLACK} />}
      />
      <ListItem
        title="계정 삭제"
        onPress={onDeleteAccount}
        icon={<Feather name="user-x" size={16} color={colors.BLACK} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  space: {
    height: 10,
  },
});
