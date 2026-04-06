import { FixedBottomCTA } from "@/components";
import useAuth from "@/hooks/queries/auth/useAuth";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import EmailDomainSuggestions from "./_components/EmailDomainSuggestions";
import EmailInput from "./_components/EmailInput";
import PasswordInput from "./_components/PasswordInput";

type FormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignupScreen() {
  const { signupMutation } = useAuth();
  const signupForm = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const [emailValue, passwordValue] = signupForm.watch(["email", "password"]);

  const onSubmit = (formValues: FormValues) => {
    const { email, password } = formValues
    signupMutation.mutate({ email, password });
  };

  return (
    <FormProvider {...signupForm}>
      <View style={styles.container}>
        <View>
          <EmailInput />
          <EmailDomainSuggestions
            value={emailValue}
            onSelect={(email: string) => signupForm.setValue("email", email)}
          // 여기서 email parameter는 자식에서 오는 값
          />
        </View>
        <PasswordInput
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          submitBehavior="submit"
          onSubmitEditingFocus="passwordConfirm"
          rules={{
            validate: (value: string) => {
              if (value.length < 8) return "비밀번호는 8자 이상 입력해주세요.";
            },
          }}
        />
        <PasswordInput
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
      <FixedBottomCTA
        label="회원가입하기"
        onPress={signupForm.handleSubmit(onSubmit)}
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
