import { getLikedPosts } from "@/api/post";
import { queryKeys } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

function useGetInfiniteLikedPosts() {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => getLikedPosts(pageParam),
    queryKey: queryKeys.POST.GET_LIKED_POSTS(),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const lastPost = lastPage[lastPage.length - 1];
      return lastPost ? allPages.length + 1 : undefined;
    },
  });
}

export default useGetInfiniteLikedPosts;
