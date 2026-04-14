import { API_BASE_URL } from "@/api/config/axiosInstance";
import { CommonButton as CustomButton, FixedBottomCTA } from "@/components";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { Href, router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import IntroduceInput from "../../../components/page/my/IntroduceInput";
import NicknameInput from "../../../components/page/my/NicknameInput";

type FormValues = {
  nickname: string;
  introduce: string;
};

export default function ProfileUpdateScreen() {
  const { auth, profileMutation } = useAuth();
  const profileForm = useForm<FormValues>({
    defaultValues: {
      nickname: auth.nickname,
      introduce: auth.introduce,
    },
  });

  const onSubmit = (formValues: FormValues) => {
    profileMutation.mutate(formValues, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "프로필이 저장되었습니다.",
        });
        router.back();
      },
    });
  };

  return (
    <FormProvider {...profileForm}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              auth.imageUri
                ? {
                  uri: `${API_BASE_URL
                    }/${auth.imageUri}`,
                }
                : require("@/assets/images/default-avatar.png")
            }
            style={styles.avatar}
          />
          <CustomButton
            size="medium"
            variant="outlined"
            label="아바타 변경"
            style={{ position: "absolute", right: 0, bottom: 0 }}
            onPress={() => router.push("/profile/avatar" as Href)}
          />
        </View>
        <View style={styles.inputContainer}>
          <NicknameInput />
          <IntroduceInput />
        </View>
      </View>

      <FixedBottomCTA
        label="저장"
        onPress={profileForm.handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 16,
    position: "relative",
  },
  avatar: {
    width: 154,
    height: 154,
    borderRadius: 154,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.GRAY_500,
  },
  inputContainer: {
    gap: 16,
  },
});
