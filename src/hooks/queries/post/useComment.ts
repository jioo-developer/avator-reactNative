import { createComment, deleteComment, toggleCommentLike, updateComment } from "@/api/comment";
import queryClient from "@/api/config/queryClient";
import { queryKeys } from "@/constants";
import type { Post } from "@/types";
import { useMutation, type InfiniteData } from "@tanstack/react-query";

const postKey = (postId: number) => queryKeys.POST.DETAIL(postId);

const useCreateComment = () => {
    return useMutation({
        mutationFn: createComment,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: postKey(variables.postId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.POST.LIST() });
        },
    });
}

const useUpdateComment = () => {
    return useMutation({
        mutationFn: ({ id, content }: { id: number; content: string; postId: number }) =>
            updateComment({ id, content }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: postKey(variables.postId) });
        },
    });
}

const useDeleteComment = () => {
    return useMutation({
        mutationFn: ({ commentId }: { commentId: number; postId: number }) => deleteComment(commentId),
        onSuccess: (_data, variables) => {
            // Feed(infinite list)에서도 댓글 수를 즉시 반영
            queryClient.setQueryData<InfiniteData<Post[]>>(queryKeys.POST.LIST(), (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) =>
                        page.map((post) =>
                            post.id === variables.postId
                                ? { ...post, commentCount: Math.max(0, (post.commentCount ?? 0) - 1) }
                                : post,
                        ),
                    ),
                };
            });

            queryClient.invalidateQueries({ queryKey: postKey(variables.postId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.POST.LIST() });
        },
    });
}

const useToggleCommentLike = () => {
    return useMutation({
        mutationFn: ({ commentId }: { commentId: number; postId: number }) => toggleCommentLike(commentId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: postKey(variables.postId) });
        },
    });
}

export { useCreateComment, useDeleteComment, useToggleCommentLike, useUpdateComment };

