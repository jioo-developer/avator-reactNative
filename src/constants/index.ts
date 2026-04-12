export { colors, default } from './Colors';

export const queryKeys = {
    AUTH: {
        ALL: ["auth"] as const,
        ME: () => [...queryKeys.AUTH.ALL, "getMe"] as const,
        GET_USER_PROFILE: (id: number) =>
            [...queryKeys.AUTH.ALL, "getUserProfile", id] as const,
    },
    POST: {
        ALL: ["post"] as const,
        LIST: () => [...queryKeys.POST.ALL, "getPosts"] as const,
        DETAIL: (postId: number) => [...queryKeys.POST.ALL, "getPost", postId] as const,
        GET_MY_POSTS: () => [...queryKeys.POST.ALL, "getMyPosts"] as const,
        GET_LIKED_POSTS: () => [...queryKeys.POST.ALL, "getLikedPosts"] as const,
    },
    PROFILE: {
        ALL: ["profile"] as const,
        GET_PROFILE: () => [...queryKeys.PROFILE.ALL, "getProfile"] as const,
    },
    AVATAR: {
        ALL: ["avatar"] as const,
    },
} as const;
