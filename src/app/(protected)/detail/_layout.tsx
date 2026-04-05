import { colors } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function DetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.BLACK,
        contentStyle: {
          backgroundColor: colors.WHITE,
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: "",
          headerShown: true,
          headerTitleAlign: "center",
          headerLeft: () => (
            <Pressable
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(protected)/(tabs)/home");
                }
              }}
            >
              <Feather name="arrow-left" size={24} color={colors.BLACK} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
