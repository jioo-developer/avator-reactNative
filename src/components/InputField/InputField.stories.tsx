import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import InputField from "./InputField";

const meta = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: 360 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof InputField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    label: "이메일",
    placeholder: "이메일을 입력해주세요.",
    variant: "filled",
  },
};

export const Outlined: Story = {
  args: {
    label: "비밀번호",
    placeholder: "비밀번호",
    variant: "outlined",
  },
};
