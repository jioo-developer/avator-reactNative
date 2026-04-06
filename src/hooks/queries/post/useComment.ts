import { createComment, deleteComment, toggleCommentLike, updateComment } from "@/api/comment";
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

const useUpdateComment = () => {
    return useMutation({
        mutationFn: updateComment,
        onSuccess: (postId: number) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.POST, queryKeys.GET_POST, postId] });
        },
    });
}

const useToggleCommentLike = () => {
    return useMutation({
        mutationFn: toggleCommentLike,
        onSuccess: (postId: number) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.POST, queryKeys.GET_POST, postId] });
        },
    });
}

export { useCreateComment, useDeleteComment, useToggleCommentLike, useUpdateComment };

