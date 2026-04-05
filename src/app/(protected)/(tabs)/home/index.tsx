import { FeedList } from "@/components";
import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FeedList />
      <Pressable
        style={styles.writeButton}
        onPress={() => router.push("/post" as Href)}
      >
        <Ionicons name="pencil" size={32} color={colors.WHITE} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  writeButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: colors.ORANGE_600,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2
  }
});
