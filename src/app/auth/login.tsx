import { FixedBottomCTA } from "@/components";
import useAuth from "@/hooks/queries/auth/useAuth";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import EmailInput from "../../components/_pageComponents/auth/EmailInput";
import PasswordInput from "../../components/_pageComponents/auth/PasswordInput";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { loginMutation } = useAuth();
  const loginForm = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (formValues: FormValues) => {
    const { email, password } = formValues;
    loginMutation.mutate({ email, password });
  };

  return (
    <FormProvider {...loginForm}>
      <View style={styles.container}>
        <EmailInput />
        <PasswordInput
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          rules={{
            validate: (value: string) => {
              if (value.length < 8) return "비밀번호는 8자 이상 입력해주세요.";
            },
          }}
        />
      </View>
      <FixedBottomCTA
        label="로그인하기"
        onPress={loginForm.handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    gap: 16,
  },
});
