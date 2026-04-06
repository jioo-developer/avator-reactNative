import { getUserInfo } from "@/api/auth";
import queryClient from "@/api/config/queryClient";
import { queryKeys } from "@/constants";
import { removeHeader, setHeader } from "@/utils/ApiHeader";
import { deleteSecureStore, getSecureStore } from "@/utils/secureStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export async function setClearAuth() {
    removeHeader("Authorization");
    await deleteSecureStore("accessToken");
    queryClient.removeQueries({ queryKey: queryKeys.AUTH.ME() });
}

// 유저 정보 조회
export function useGetUserInfo() {
    const { data, isSuccess, isError, isPending } = useQuery({
        queryFn: getUserInfo,
        queryKey: queryKeys.AUTH.ME(),
    });

    useEffect(() => {
        (async () => {
            if (isError) {
                await setClearAuth();
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