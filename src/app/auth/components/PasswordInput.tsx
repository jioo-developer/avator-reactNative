import InputField from "@/components/InputField/InputField";
import React from "react";
import { Controller, type RegisterOptions, useFormContext } from "react-hook-form";
import type { TextInputProps } from "react-native";

type Props = {
  name: "password" | "passwordConfirm";
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  submitBehavior?: TextInputProps["submitBehavior"];
  onSubmitEditingFocus?: "password" | "passwordConfirm";
  rules?: RegisterOptions;
};

function PasswordInput({
  name,
  label,
  placeholder,
  secureTextEntry = true,
  submitBehavior = "blurAndSubmit",
  onSubmitEditingFocus,
  rules,
}: Props) {
  const { control, setFocus } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
        <InputField
          ref={ref}
          label={label}
          placeholder={placeholder}
          submitBehavior={submitBehavior}
          textContentType="oneTimeCode"
          secureTextEntry={secureTextEntry}
          value={(value ?? "") as string}
          onChangeText={onChange}
          error={error?.message}
          onSubmitEditing={
            onSubmitEditingFocus ? () => setFocus(onSubmitEditingFocus) : undefined
          }
        />
      )}
    />
  );
}

export default PasswordInput;
