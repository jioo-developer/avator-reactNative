import type { Meta, StoryObj } from "@storybook/react";
import { Text, View } from "react-native";
import { fn } from "storybook/test";
import Profile from "./Profile";

const meta = {
  title: "Components/Profile",
  component: Profile,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: 360 }}>
        <Story />
      </View>
    ),
  ],
  args: { onPress: fn() },
} satisfies Meta<typeof Profile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultAvatar: Story = {
  args: {
    nickname: "닉네임",
    createdAt: "2025-01-01",
  },
};

export const WithRemoteImage: Story = {
  args: {
    nickname: "사용자",
    createdAt: "2025-02-01",
    imageUri: "https://picsum.photos/100",
  },
};

export const WithOption: Story = {
  args: {
    nickname: "닉네임",
    createdAt: "오늘",
    option: <Text style={{ color: "#6B7280" }}>⋯</Text>,
  },
};
