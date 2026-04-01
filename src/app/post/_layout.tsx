import { colors } from "@/constants";
import { Stack } from "expo-router";

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
                }}
            />
        </Stack>
    );
}
