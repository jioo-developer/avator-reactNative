import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import PasswordConfirmInput from "./PasswordConfirmInput";
import PasswordInput from "./PasswordInput";

type AuthForm = {
  email: string;
  password: string;
  passwordConfirm: string;
};

function PasswordConfirmStoryWrapper() {
  const methods = useForm<AuthForm>({
    defaultValues: { email: "", password: "", passwordConfirm: "" },
  });

  return (
    <FormProvider {...methods}>
      <View style={{ gap: 16 }}>
        <PasswordInput />
        <PasswordConfirmInput />
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
