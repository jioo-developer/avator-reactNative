import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { useDeletePost, useTogglePostLike } from "@/hooks/queries/post/usePost";
import type { Post } from "@/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { router } from "expo-router";

export function useDetailActions(post: Post) {
  const { auth } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const { mutate: deletePost } = useDeletePost();
  const togglePostLike = useTogglePostLike();

  const isLiked = post.likes?.some((like) => Number(like.userId) === Number(auth.id)) ?? false;
  const isAuthor = Number(auth.id) === Number(post.author.id);

  const onPressOption = () => {
    const options = ["수정", "삭제", "취소"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        tintColor: colors.PRIMARY,
        cancelButtonTintColor: colors.GRAY_700,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            router.push({ pathname: "/post/update/[id]", params: { id: String(post.id) } });
            break;
          case destructiveButtonIndex:
            deletePost(post.id, { onSuccess: () => router.back() });
            break;
          case cancelButtonIndex:
            break;
          default:
            break;
        }
      }
    );
  };

  return {
    isAuthor,
    isLiked,
    isLikePending: togglePostLike.isPending,
    onToggleLike: () => togglePostLike.mutate(post.id),
    onPressOption,
  };
}

