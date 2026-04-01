import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import PasswordField from "../PasswordInput";

type AuthForm = {
  email: string;
  password: string;
  passwordConfirm: string;
};

function PasswordConfirmStoryWrapper() {
  const methods = useForm<AuthForm>({
    defaultValues: { email: "", password: "", passwordConfirm: "" },
  });
  const passwordValue = methods.watch("password");

  return (
    <FormProvider {...methods}>
      <View style={{ gap: 16 }}>
        <PasswordField
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          rules={{
            validate: (value: string) => {
              if (value.length < 8) return "비밀번호는 8자 이상 입력해주세요.";
            },
          }}
        />
        <PasswordField
          name="passwordConfirm"
          label="비밀번호 확인"
          placeholder="비밀번호를 입력해주세요."
          rules={{
            validate: (value: string) => {
              if (value !== passwordValue) return "비밀번호가 일치하지 않습니다.";
            },
          }}
        />
      </View>
    </FormProvider>
  );
}

const meta = {
  title: "Components/InputField/Modules/PasswordConfirmInput",
  component: PasswordConfirmStoryWrapper,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: 360 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PasswordConfirmStoryWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithPasswordField: Story = {};
