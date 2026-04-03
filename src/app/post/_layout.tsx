import { colors } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function PostLayout() {
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
                name="write"
                options={{
                    title: "글쓰기",
                    headerShown: true,
                    headerLeft: () => (
                        <Pressable
                            onPress={() => router.replace("/(tabs)/home")}
                        >
                            <Feather name="arrow-left" size={24} color={colors.BLACK} />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen
                name="[id]"
                options={{
                    title: "",
                    headerShown: true,
                    headerLeft: () => (
                        <Pressable
                            onPress={() => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace("/(tabs)/home");
                                }
                            }}
                        >
                            <Feather
                                name="arrow-left"
                                size={24}
                                color={colors.BLACK}
                            />
                        </Pressable>
                    ),
                }}
            />

            <Stack.Screen
                name="update/[id]"
                options={{
                    title: "게시글 수정",
                    headerShown: true,
                }}
            />
        </Stack>
    );
}
