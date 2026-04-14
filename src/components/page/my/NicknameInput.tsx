import { InputField } from "@/components";
import { Controller, useFormContext } from "react-hook-form";

function NicknameInput() {
  const { control, setFocus } = useFormContext();

  return (
    <Controller
      name="nickname"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length < 2) {
            return "닉네임은 2자이상 입력해주세요.";
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputField
          label="닉네임"
          placeholder="닉네임을 입력해주세요."
          inputMode="text"
          returnKeyType="next"
          submitBehavior="submit"
          value={value}
          onChangeText={onChange}
          onSubmitEditing={() => setFocus("introduce")}
          error={error?.message}
        />
      )}
    />
  );
}

export default NicknameInput;
