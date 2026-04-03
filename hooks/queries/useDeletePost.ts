import queryClient from "@/api/config/queryClient";
import { deletePost } from "@/api/post";
import { queryKeys } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useDeletePost() {
    return useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.POST, queryKeys.GET_POSTS] });
        },
    });
}

export default useDeletePost;