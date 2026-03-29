import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import EmailInput from "./EmailInput";

type AuthForm = {
  email: string;
  password: string;
  passwordConfirm: string;
};

function EmailInputStoryWrapper() {
  const methods = useForm<AuthForm>({
    defaultValues: { email: "", password: "", passwordConfirm: "" },
  });

  return (
    <FormProvider {...methods}>
      <EmailInput />
    </FormProvider>
  );
}

const meta = {
  title: "Components/InputField/Modules/EmailInput",
  component: EmailInputStoryWrapper,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: 360 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EmailInputStoryWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
