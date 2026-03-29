import FixedBottomCTA from "@/components/FixedBottomCTA";
import EmailDomainSuggestions from "@/components/InputField/modules/EmailDomainSuggestions";
import EmailInput from "@/components/InputField/modules/EmailInput";
import PasswordConfirmInput from "@/components/InputField/modules/PasswordConfirmInput";
import PasswordInput from "@/components/InputField/modules/PasswordInput";
import useAuth from "@/hooks/queries/useAuth";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

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

  const emailValue = signupForm.watch("email");

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
            onSelect={(email) => signupForm.setValue("email", email)}
          />
        </View>
        <PasswordInput submitBehavior="submit" />
        <PasswordConfirmInput />
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
