import { colors } from "@/constants";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const APP_VERSION = "1.0";

export default function AppVersionScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.center}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.status}>최신 버전이 아닙니다.</Text>
        <Text style={styles.version}>현재 버전: {APP_VERSION}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.updateBtn,
            pressed && styles.updateBtnPressed,
          ]}
        >
          <Text style={styles.updateBtnText}>최신 버전으로 업데이트</Text>
        </Pressable>
      </View>
      <Text style={styles.footer}>
        더 안정적이고 빠른 서비스를 위해 정기적으로 업데이트를 제공합니다.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.GRAY_200,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 28,
  },
  status: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.GRAY_700,
    marginBottom: 10,
  },
  version: {
    fontSize: 15,
    color: colors.GRAY_600,
    marginBottom: 28,
  },
  updateBtn: {
    alignSelf: "stretch",
    backgroundColor: colors.GREEN_600,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  updateBtnPressed: {
    opacity: 0.88,
  },
  updateBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.WHITE,
  },
  footer: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.GRAY_500,
    textAlign: "center",
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
});