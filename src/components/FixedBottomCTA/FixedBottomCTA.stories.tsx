import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import { fn } from "storybook/test";
import FixedBottomCTA from "./FixedBottomCTA";

const meta = {
  title: "Components/FixedBottomCTA",
  component: FixedBottomCTA,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ height: 200, width: 360, position: "relative" }}>
        <Story />
      </View>
    ),
  ],
  args: { onPress: fn() },
} satisfies Meta<typeof FixedBottomCTA>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "로그인하기" },
};
