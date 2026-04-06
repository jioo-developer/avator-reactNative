export { colors, default } from './Colors';

const queryKeys = {
    AUTH: "auth",
    POST: "post",
    GET_ME: "getMe",
    GET_POSTS: "getPosts",
    GET_POST: "getPost",
};

export const POSTS_QUERY_KEY = [queryKeys.POST, queryKeys.GET_POSTS] as const;

export { queryKeys };
