import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import FeedList from "./FeedList";

const meta = {
  title: "Components/FeedList",
  component: FeedList,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ height: 520, width: 400 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof FeedList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
