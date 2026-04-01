import { getPosts } from "@/api/post";
import { queryKeys } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

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

export default useGetInfinitePosts;