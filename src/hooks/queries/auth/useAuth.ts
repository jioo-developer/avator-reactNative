import { deleteAccount, getUserInfo, postsLogin, postsSignUp } from "@/api/auth";
import queryClient from "@/api/config/queryClient";
import { editProfile } from "@/api/profile";
import { queryKeys } from "@/constants";
import { User } from "@/types";
import { setHeader } from "@/utils/ApiHeader";
import { saveSecureStore } from "@/utils/secureStore";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { setClearAuth, useGetUserInfo } from "./useGetUserInfo";

function useSignup() {
  return useMutation({
    mutationFn: postsSignUp,
    onSuccess: () => {
      router.replace("/auth/login");
      Toast.show({
        type: "success",
        text1: "회원가입이 완료되었습니다.",
      });
    },
    onError: () => {
      console.log("signup error");
    },
  });
}

function useLogin() {
  return useMutation({
    mutationFn: postsLogin,
    onSuccess: async ({ accessToken }) => {
      // 헤더 설정
      setHeader("Authorization", `Bearer ${accessToken}`);
      // 토큰 저장
      await saveSecureStore("accessToken", accessToken);
      // 유저 정보 조회
      const userInfo = await queryClient.fetchQuery<User>({
        queryKey: queryKeys.AUTH.ME(),
        queryFn: getUserInfo,
      });
      // 로그인 이후 액션
      Toast.show({
        type: "success",
        text1: `${userInfo.nickname}님 환영합니다.`,
      });
      router.replace("/(protected)/(tabs)/home");
    },
    onError: () => {
      Alert.alert(
        "로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.",
      );
    },
  });
}

function useUpdateProfile() {
  return useMutation({
    mutationFn: editProfile,
    onSuccess: (newProfile) => {
      queryClient.setQueryData(queryKeys.AUTH.ME(), newProfile);
      queryClient.invalidateQueries({ queryKey: queryKeys.POST.ALL });
    },
  });
}

function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await setClearAuth();
      router.replace("/auth");
      Toast.show({
        type: "success",
        text1: "계정이 삭제되었습니다.",
      });
    },
    onError: () => {
      Alert.alert(
        "오류",
        "계정 삭제에 실패했습니다. 다시 시도해주세요.",
      );
    },
  });
}

async function logout() {
  await setClearAuth();
  router.replace("/auth");
}

function useAuth() {
  const { data, isPending } = useGetUserInfo();
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const profileMutation = useUpdateProfile();
  const deleteAccountMutation = useDeleteAccount();
  return {
    auth: {
      id: data?.id || "",
      nickname: data?.nickname || "",
      imageUri: data?.imageUri || "",
      introduce: data?.introduce || "",
      hatId: data?.hatId || "",
      handId: data?.handId || "",
      skinId: data?.skinId || "",
      topId: data?.topId || "",
      bottomId: data?.bottomId || "",
      faceId: data?.faceId || "",
    },
    isAuthLoading: isPending,
    loginMutation,
    signupMutation,
    profileMutation,
    deleteAccountMutation,
    logout,
  };
}

export default useAuth;
