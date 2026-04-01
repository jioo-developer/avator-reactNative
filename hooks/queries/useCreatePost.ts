import queryClient from "@/api/config/queryClient";
import { createPost } from "@/api/post";
import { queryKeys } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

function useCreatePost() {
    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            router.replace("/(tabs)/home");
            queryClient.invalidateQueries({ queryKey: [queryKeys.POST, queryKeys.GET_POSTS] });
            Toast.show({
                type: "success",
                text1: "게시글이 생성되었습니다.",
            });
        },
        onError: () => {
            Toast.show({
                type: "error",
                text1: "게시글 생성에 실패했습니다.",
            });
        },
    });
}

export default useCreatePost;