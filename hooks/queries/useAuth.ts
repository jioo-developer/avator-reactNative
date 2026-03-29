import { getUserInfo, postsLogin, postsSignUp } from "@/api/auth";
import queryClient from "@/api/queryClient";
import { removeHeader, setHeader } from "@/utils/ApiHeader";
import { deleteSecureStore, saveSecureStore } from "@/utils/secureStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";

function useGetInfo() {
    const { data, isError } = useQuery({
        queryKey: ["auth", "getInfo"],
        queryFn: getUserInfo,
    });

    useEffect(() => {
        if (isError) {
            removeHeader("Authorization");
            deleteSecureStore("accessToken");
            router.replace("/auth");
        }
    }, [isError]);

    return { data };
}

function useLogin() {
    return useMutation({
        mutationFn: postsLogin,
        onSuccess: async ({ accessToken }) => {
            setHeader("Authorization", `Bearer ${accessToken}`);
            await saveSecureStore("accessToken", accessToken);
            queryClient.fetchQuery({ queryKey: ["auth", "getInfo"] });
            router.replace("/(tabs)/home");
        },
        onError: (error) => {
            console.log(error);
        },
    });
}

function useSignUp() {
    return useMutation({
        mutationFn: postsSignUp,
        onSuccess: () => {
            router.replace("/auth/login");
        },
        onError: (error) => {
            console.log(error);
        },
    });
}

function useAuth() {
    const { data } = useGetInfo();
    const loginMuation = useLogin();
    const signUpMuation = useSignUp();

    return {
        auth: { id: data?.id },
        loginMuation,
        signUpMuation,
    };
}

export default useAuth;