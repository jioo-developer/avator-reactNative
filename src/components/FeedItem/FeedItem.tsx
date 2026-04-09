import { colors } from "@/constants";
import type { Post } from "@/types";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Profile from "../Profile/Profile";
import ImagePreviewList from "@/app/(protected)/post/_components/ImagePreviewList";

type FeedItemVariant = "list" | "detail";

interface FeedItemProps {
  post: Post;
  variant: FeedItemVariant;
  isLiked: boolean;
  isLikePending?: boolean;
  onPressContent?: () => void;
  onToggleLike: () => void;
  headerOption?: ReactNode;
}

function FeedItem({
  post,
  variant,
  isLiked,
  isLikePending = false,
  onPressContent,
  onToggleLike,
  headerOption,
}: FeedItemProps) {

  const isDetail = variant === "detail";

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.contentContainer}
        onPress={isDetail ? undefined : onPressContent}
        disabled={isDetail}
      >
        <>
          <Profile
            onPress={() => { }}
            imageUri={post.author.imageUri}
            nickname={post.author.nickname}
            createdAt={post.createdAt}
            option={headerOption}
          />
          <Text style={styles.title}>{post.title}</Text>
          <Text numberOfLines={3} style={styles.description}>
            {post.description}
          </Text>
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
        </>
      </Pressable>
      <View style={styles.menuContainer}>
        <Pressable style={styles.menu} disabled={isLikePending} onPress={onToggleLike}>
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
  imagePreviewWrapper: {
    marginTop: 8,
    marginBottom: 4,
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
});

export default FeedItem;
export type { FeedItemProps, FeedItemVariant };

