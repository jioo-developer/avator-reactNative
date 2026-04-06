import queryClient from "@/api/config/queryClient";
import { createPost, deletePost, getPost, getPosts, updatePost } from "@/api/post";
import { queryKeys } from "@/constants";
import type { Post } from "@/types";
import {
    useInfiniteQuery,
    useMutation,
    useSuspenseQuery,
    type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

function useCreatePost() {
    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            router.replace("/(protected)/(tabs)/home");
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

function useGetPostSuspense(id: number): UseSuspenseQueryResult<Post, Error> {
    return useSuspenseQuery({
        queryKey: [queryKeys.POST, queryKeys.GET_POST, id],
        queryFn: () => getPost(Number(id)),
        staleTime: 0,
        refetchOnMount: "always",
    });
}

function useGetInfinitePosts() {
    return useInfiniteQuery({
        queryKey: [queryKeys.POST, queryKeys.GET_POSTS],
        queryFn: ({ pageParam }) => getPosts(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const lastPost = lastPage[lastPage.length - 1];
            return lastPost ? allPages.length + 1 : undefined;
        },
    });
}

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


function useDeletePost() {
    return useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.POST, queryKeys.GET_POSTS] });
        },
    });
}

export {
    useCreatePost,
    useDeletePost,
    useGetInfinitePosts,
    useGetPostSuspense,
    useUpdatePost
};

