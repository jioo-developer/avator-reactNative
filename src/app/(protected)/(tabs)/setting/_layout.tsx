import { colors } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function SettingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.GRAY_200,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "설정",
        }}
      />
      <Stack.Screen
        name="version"
        options={{
          headerShown: true,
          title: "앱 버전 정보",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.GRAY_200 },
          headerTintColor: colors.GRAY_700,
          headerTitleStyle: { color: colors.GRAY_700, fontWeight: "600" },
          contentStyle: { backgroundColor: colors.GRAY_200 },
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={{ marginLeft: 4 }}
            >
              <Feather name="arrow-left" size={24} color={colors.GRAY_700} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
