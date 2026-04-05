import { createComment, deleteComment } from "@/api/comment";
import queryClient from "@/api/config/queryClient";
import { queryKeys } from "@/constants";
import { useMutation } from "@tanstack/react-query";

const useCreateComment = () => {
    return useMutation({
        mutationFn: createComment,
        onSuccess: (postId: number) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.POST, queryKeys.GET_POST, postId] });
        },
    });
}

const useDeleteComment = () => {
    return useMutation({
        mutationFn: deleteComment,
        onSuccess: (postId: number) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.POST, queryKeys.GET_POST, postId] });
        },
    });
}

export { useCreateComment, useDeleteComment };

