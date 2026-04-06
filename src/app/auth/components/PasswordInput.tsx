import { InputField } from "@/components";
import React, { useState } from "react";
import { Controller, type RegisterOptions, useFormContext } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, type TextInputProps } from "react-native";

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
  const [isSecure, setIsSecure] = useState(secureTextEntry);

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
          secureTextEntry={isSecure}
          value={(value ?? "") as string}
          onChangeText={onChange}
          error={error?.message}
          rightElement={
            <Pressable
              hitSlop={10}
              onPress={() => setIsSecure((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel={isSecure ? "비밀번호 표시" : "비밀번호 숨기기"}
            >
              <Ionicons
                name={isSecure ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={error ? "#ef4444" : "#6b7280"}
              />
            </Pressable>
          }
          onSubmitEditing={
            onSubmitEditingFocus ? () => setFocus(onSubmitEditingFocus) : undefined
          }
        />
      )}
    />
  );
}

export default PasswordInput;
