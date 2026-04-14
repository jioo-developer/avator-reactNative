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

export const Standard: Story = {
  args: {
    label: "닉네임",
    placeholder: "닉네임을 입력해주세요.",
    variant: "standard",
  },
};

export const Outlined: Story = {
  args: {
    label: "비밀번호",
    placeholder: "비밀번호",
    variant: "outlined",
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "라벨 없이 표시",
    variant: "filled",
  },
};

export const WithError: Story = {
  args: {
    label: "이메일",
    placeholder: "이메일을 입력해주세요.",
    variant: "filled",
    defaultValue: "invalid-email",
    error: "올바른 이메일 형식이 아닙니다.",
  },
};

export const Disabled: Story = {
  args: {
    label: "읽기 전용",
    placeholder: "수정할 수 없습니다",
    variant: "filled",
    editable: false,
    value: "고정된 값",
  },
};

export const Password: Story = {
  args: {
    label: "비밀번호",
    placeholder: "8자 이상 입력",
    variant: "filled",
    secureTextEntry: true,
  },
};

export const EmailInput: Story = {
  args: {
    label: "이메일",
    placeholder: "example@email.com",
    variant: "filled",
    keyboardType: "email-address",
    autoCapitalize: "none",
    autoCorrect: false,
  },
};
