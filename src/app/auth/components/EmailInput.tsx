import InputField from "@/components/InputField/InputField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

function EmailInput() {
  const { control, setFocus } = useFormContext();

  return (
    <Controller
      name="email"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length === 0) {
            return "이메일을 입력해주세요.";
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
            return "올바른 이메일 형식이 아닙니다.";
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <InputField
            autoFocus
            label="이메일"
            placeholder="이메일을 입력해주세요."
            inputMode="email"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => setFocus("password")}
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        </View>
      )}
    />
  );
}

export default EmailInput;
