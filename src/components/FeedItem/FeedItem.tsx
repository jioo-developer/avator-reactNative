import ImagePreviewList from "@/components/_pageComponents/post/ImagePreviewList";
import Vote from "@/components/_pageComponents/post/vote/Vote";
import { colors } from "@/constants";
import { useTogglePostLike } from "@/hooks/queries/post/usePost";
import type { Post } from "@/types";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import React, { type ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Profile from "../Profile/Profile";

export type FeedItemVariant = "list" | "detail";

export interface FeedItemProps {
  post: Post;
  variant: FeedItemVariant;
  isLiked: boolean;
  onPressContent?: () => void;
  headerOption?: ReactNode;
}

function FeedItem({
  post,
  variant,
  isLiked,
  onPressContent,
  headerOption,
}: FeedItemProps) {

  const isDetail = variant === "detail";

  const { mutate: togglePostLike, isPending } = useTogglePostLike();

  const handleToggleLike = () => {
    if (isDetail) {
      togglePostLike(post.id);
    } else {
      router.push({ pathname: "/detail/[id]", params: { id: String(post.id) } });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.contentContainer}
        onPress={!isDetail ? onPressContent : undefined}
        disabled={isDetail}
      >
        <>
          <Profile
            imageUri={post.author.imageUri}
            nickname={post.author.nickname}
            createdAt={post.createdAt}
            onPress={() =>
              router.push(`/profile/${post.author.id}` as Href)
            }
            option={headerOption}
          />
          <Text style={styles.title}>{post.title}</Text>
          <Text numberOfLines={3} style={styles.description}>
            {post.description}
          </Text>
          {/* 이미지 영역 */}
          {Array.isArray(post.imageUris) && post.imageUris.length > 0 && (
            <View style={styles.imagePreviewWrapper}>
              <ImagePreviewList
                imageUris={post.imageUris}
                variant="fullWidth"
                fullWidthHorizontalInset={32}
                enableZoom={isDetail}
              />
            </View>
          )}
          {/* 투표 미리보기 영역 */}
          {!isDetail && post.hasVote && (
            <View style={styles.votePreviewHome}>
              <Image
                source={require("@/assets/images/vote-preview.png")}
                style={styles.votePreviewIcon}
                accessibilityLabel="투표"
              />
              <Text style={styles.votePreviewLabel}>투표</Text>
              <Text style={styles.votePreviewCount}>
                {post.voteCount}명 참여중...
              </Text>
            </View>
          )}
          {/* 상세페이지 투표 영역 */}
          {isDetail && post.hasVote && (
            <Vote
              postId={post.id}
              postVotes={post.votes ?? []}
              voteCount={post.voteCount}
            />
          )}
        </>
      </Pressable>
      {/* 하단 GNB 메뉴 영역 (좋아요, 댓글, 조회수) */}
      <View style={styles.menuContainer}>
        <Pressable style={styles.menu} disabled={isPending} onPress={handleToggleLike}>
          <Octicons
            name={isLiked ? "heart-fill" : "heart"}
            size={16}
            color={isLiked ? colors.ORANGE_600 : colors.BLACK}
          />
          <Text style={isLiked ? styles.activeMenuText : styles.menuText}>
            {post.likes?.length ?? 0}
          </Text>
        </Pressable>
        <Pressable style={styles.menu}>
          <MaterialCommunityIcons
            name="comment-processing-outline"
            size={16}
            color={colors.BLACK}
          />
          <Text style={styles.menuText}>{post.commentCount ?? "댓글"}</Text>
        </Pressable>
        <Pressable style={styles.menu}>
          <Ionicons name="eye-outline" size={16} color={colors.BLACK} />
          <Text style={styles.menuText}>{post.viewCount || "조회수"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    color: colors.BLACK,
    fontWeight: "600",
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: colors.BLACK,
    marginBottom: 14,
  },
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopColor: colors.GRAY_300,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    width: "33%",
    gap: 4,
  },
  menuText: {
    fontSize: 14,
    color: colors.GRAY_700,
  },
  activeMenuText: {
    fontWeight: "500",
    color: colors.ORANGE_600,
  },
  imagePreviewWrapper: {
    marginBottom: 12,
  },
  votePreviewIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  votePreviewHome: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.VOTE_PREVIEW_BORDER,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  votePreviewLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.VOTE_LABEL,
  },
  votePreviewCount: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.BLACK,
    marginLeft: 5
  },
});

export default FeedItem;

