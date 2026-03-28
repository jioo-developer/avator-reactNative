import type { Meta, StoryObj } from "@storybook/react";
import { dummyData } from "@/constants";
import { View } from "react-native";
import FeedItem from "./FeedItem";

const meta = {
  title: "Components/FeedItem",
  component: FeedItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: 400 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof FeedItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { post: dummyData[0] },
};

export const Second: Story = {
  args: { post: dummyData[1] },
};
