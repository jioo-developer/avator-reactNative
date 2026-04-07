import queryClient from "@/api/config/queryClient";
import {
    createPost,
    deletePost,
    getPost,
    getPosts,
    increasePostView,
    togglePostLike,
    updatePost,
} from "@/api/post";
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
            queryClient.invalidateQueries({ queryKey: queryKeys.POST.LIST() });
            Toast.show({
                type: "success",
                text1: "게시글이 생성되었습니다.",
            });
        },
    });
}

function useGetPostSuspense(id: number): UseSuspenseQueryResult<Post, Error> {
    return useSuspenseQuery({
        queryKey: queryKeys.POST.DETAIL(id),
        queryFn: () => getPost(Number(id)),
        staleTime: 0,
        refetchOnMount: "always",
    });
}

function useGetInfinitePosts() {
    return useInfiniteQuery({
        queryKey: queryKeys.POST.LIST(),
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
            queryClient.invalidateQueries({ queryKey: queryKeys.POST.DETAIL(postId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.POST.LIST() });
            router.back();
        },
    });
}


function useDeletePost() {
    return useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.POST.LIST() });
        },
    });
}

function useIncreasePostView() {
    return useMutation({
        mutationFn: (postId: number) => increasePostView(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.POST.LIST() });
        },
    });
}

function useTogglePostLike() {
    return useMutation({
        mutationFn: (postId: number) => togglePostLike(postId),
        onSuccess: (postId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.POST.DETAIL(postId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.POST.LIST() });
        },
    });
}

export {
    useCreatePost,
    useDeletePost,
    useGetInfinitePosts,
    useGetPostSuspense,
    useIncreasePostView,
    useTogglePostLike,
    useUpdatePost
};

