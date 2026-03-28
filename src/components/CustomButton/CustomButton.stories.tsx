import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import { fn } from "storybook/test";
import CustomButton from "./CustomButton";

const meta = {
  title: "Components/CustomButton",
  component: CustomButton,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: 360 }}>
        <Story />
      </View>
    ),
  ],
  args: { onPress: fn() },
} satisfies Meta<typeof CustomButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LargeFilled: Story = {
  args: { label: "버튼", size: "large", variant: "filled" },
};

export const MediumFilled: Story = {
  args: { label: "중간", size: "medium", variant: "filled" },
};
