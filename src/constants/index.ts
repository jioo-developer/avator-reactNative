export { colors, default } from './Colors';

export const queryKeys = {
    AUTH: {
        ALL: ["auth"] as const,
        ME: () => [...queryKeys.AUTH.ALL, "getMe"] as const,
    },
    POST: {
        ALL: ["post"] as const,
        LIST: () => [...queryKeys.POST.ALL, "getPosts"] as const,
        DETAIL: (postId: number) => [...queryKeys.POST.ALL, "getPost", postId] as const,
    },
} as const;
