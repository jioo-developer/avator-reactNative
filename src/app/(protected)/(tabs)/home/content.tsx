import FeedItem from "@/components/FeedItem/FeedItem";
import useAuth from "@/hooks/queries/auth/useAuth";
import { useTogglePostLike } from "@/hooks/queries/post/usePost";
import { Post } from "@/types";
import { router } from "expo-router";
import React from "react";

export function Content({ post }: { post: Post }) {
  const { auth } = useAuth();
  const togglePostLike = useTogglePostLike();

  const isLiked = post.likes?.some((like) => Number(like.userId) === Number(auth.id)) ?? false;

  return (
    <FeedItem
      post={post}
      variant="list"
      isLiked={isLiked}
      isLikePending={togglePostLike.isPending}
      onToggleLike={() => togglePostLike.mutate(post.id)}
      onPressContent={() =>
        router.push({ pathname: "/detail/[id]", params: { id: String(post.id) } })
      }
    />
  );
}
