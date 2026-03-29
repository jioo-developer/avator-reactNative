import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import PasswordInput from "./PasswordInput";

type AuthForm = {
  email: string;
  password: string;
  passwordConfirm: string;
};

function PasswordInputStoryWrapper() {
  const methods = useForm<AuthForm>({
    defaultValues: { email: "", password: "", passwordConfirm: "" },
  });

  return (
    <FormProvider {...methods}>
      <PasswordInput />
    </FormProvider>
  );
}

const meta = {
  title: "Components/InputField/Modules/PasswordInput",
  component: PasswordInputStoryWrapper,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: 360 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PasswordInputStoryWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
