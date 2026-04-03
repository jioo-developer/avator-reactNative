import queryClient from "@/api/config/queryClient";
import { updatePost } from "@/api/post";
import { queryKeys } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

function useUpdatePost() {
    return useMutation({
        mutationFn: updatePost,
        onSuccess: (postId) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.POST, queryKeys.GET_POST, postId] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.POST, queryKeys.GET_POSTS] });
            router.back();
        },
    });
}

export default useUpdatePost;