import { getPost } from "@/api/post";
import { queryKeys } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export function useGetPost(id: number) {
    return useQuery({
        queryKey: [queryKeys.POST, queryKeys.GET_POST, id],
        queryFn: () => getPost(Number(id)),
        enabled: Boolean(id),
    });
}