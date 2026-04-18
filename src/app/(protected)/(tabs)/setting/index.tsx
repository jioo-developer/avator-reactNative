import CommonToggle from "@/components/Common/CommonToggle/CommonToggle";
import ListItem from "@/components/page/setting/ListItem";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { Entypo, Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const { logout } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(false);
  return (
    <SafeAreaView>
      <View style={styles.space} />
      <ListItem
        title="언어 설정"
        onPress={() => Alert.alert("준비 중 입니다.")}
        icon={<Entypo name="language" size={16} color={colors.BLACK} />}
      />
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>앱 푸시 알림</Text>
        <CommonToggle
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
      </View>
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
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: colors.WHITE,
    borderColor: colors.GRAY_200,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.BLACK,
  },
});
