import { getUserInfo, postsLogin, postsSignUp } from "@/api/auth";
import queryClient from "@/api/config/queryClient";
import { queryKeys } from "@/constants";
import { User } from "@/types";
import { removeHeader, setHeader } from "@/utils/ApiHeader";
import { deleteSecureStore, getSecureStore, saveSecureStore } from "@/utils/secureStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

function useGetUserInfo() {
    const { data, isSuccess, isError, isPending } = useQuery({
        queryFn: getUserInfo,
        queryKey: [queryKeys.AUTH, queryKeys.GET_ME],
    });

    useEffect(() => {
        (async () => {
            if (isError) {
                removeHeader("Authorization");
                await deleteSecureStore("accessToken");
                queryClient.removeQueries({ queryKey: [queryKeys.AUTH, queryKeys.GET_ME] });
                return;
            }

            if (isSuccess) {
                const accessToken = await getSecureStore("accessToken");
                if (accessToken) {
                    setHeader("Authorization", `Bearer ${accessToken}`);
                }
            }
        })();
    }, [isError, isSuccess]);

    return { data, isPending };
}

function useLogin() {
    return useMutation({
        mutationFn: postsLogin,
        onSuccess: async ({ accessToken }) => {
            setHeader("Authorization", `Bearer ${accessToken}`);
            await saveSecureStore("accessToken", accessToken);
            const userInfo = await queryClient.fetchQuery<User>({
                queryKey: [queryKeys.AUTH, queryKeys.GET_ME],
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
        queryClient.removeQueries({ queryKey: [queryKeys.AUTH, queryKeys.GET_ME] });
        router.replace("/auth");
    };

    return {
        auth: {
            id: data?.id || "",
            nickname: data?.nickname || "",
        },
        isAuthLoading: isPending,
        loginMutation,
        signupMutation,
        logout,
    };
}

export default useAuth;
