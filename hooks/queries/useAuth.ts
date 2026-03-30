import { getUserInfo, postsLogin, postsSignUp } from "@/api/auth";
import queryClient from "@/api/queryClient";
import { removeHeader, setHeader } from "@/utils/ApiHeader";
import { deleteSecureStore, saveSecureStore } from "@/utils/secureStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

function useGetUserInfo() {
    const { data, isError, isPending } = useQuery({
        queryFn: getUserInfo,
        queryKey: ["auth", "getUserInfo"],
    });

    useEffect(() => {
        if (isError) {
            removeHeader("Authorization");
            deleteSecureStore("accessToken");
            queryClient.removeQueries({ queryKey: ["auth", "getUserInfo"] });
        }
    }, [isError]);

    return { data, isPending };
}

function useLogin() {
    return useMutation({
        mutationFn: postsLogin,
        onSuccess: async ({ accessToken }) => {
            setHeader("Authorization", `Bearer ${accessToken}`);
            await saveSecureStore("accessToken", accessToken);
            const userInfo = await queryClient.fetchQuery({
                queryKey: ["auth", "getUserInfo"],
                queryFn: getUserInfo,
            });

            Toast.show({
                type: "success",
                text1: `${userInfo.nickname}님 환영합니다.`,
            });
            router.replace("/(tabs)/home");
        },
        onError: () => {
            Alert.alert("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
        },
    });
}

function useSignup() {
    return useMutation({
        mutationFn: postsSignUp,
        onSuccess: () => router.replace("/auth/login"),
        onError: () => {
            console.log("signup error");
        },
    });
}

function useAuth() {
    const { data, isPending } = useGetUserInfo();
    const loginMutation = useLogin();
    const signupMutation = useSignup();

    const logout = async () => {
        removeHeader("Authorization");
        await deleteSecureStore("accessToken");
        queryClient.removeQueries({ queryKey: ["auth", "getUserInfo"] });
        router.replace("/auth");
    };

    return {
        auth: {
            id: data?.id || "",
            email: data?.email || "",
            nickname: data?.nickname || "",
        },
        isAuthLoading: isPending,
        loginMutation,
        signupMutation,
        logout,
    };
}

export default useAuth;
