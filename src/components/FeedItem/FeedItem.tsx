import Profile from "../Profile/Profile";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { useDeletePost } from "@/hooks/queries/post/usePost";
import { Post } from "@/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
interface FeedItemProps {
  post: Post;
  isUsedInDetail?: boolean;
}

function FeedItem({ post, isUsedInDetail = false }: FeedItemProps) {
  const { auth } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  // action sheet 메뉴 라이브러리
  const { mutate: deletePost } = useDeletePost();
  // 게시글 삭제 핸들러

  const isUsers = post.likes?.map(like => Number(like.userId));
  const isLiked = isUsers?.includes(Number(auth.id));
  // 좋아요를 사용한 유저들의 id를 가져와서 현재 유저의 id와 비교

  // 게시글 옵션 메뉴 눌렀을 때 표시되는 메뉴 핸들러
  const handlePressOption = () => {
    const options = ["수정", "삭제", "취소"];
    const destructiveButtonIndex = 1; // 삭제
    const cancelButtonIndex = 2; // 취소

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
            deletePost(post.id, {
              onSuccess: () => isUsedInDetail && router.back(),
            });
            break;
          case cancelButtonIndex:
            break;
          default:
            break;
        }
      })
  };

  const handlePressFeed = () => {
    if (!isUsedInDetail) {
      router.push({ pathname: "/detail/[id]", params: { id: String(post.id) } });
    }
  }
  const ContainerComponent = isUsedInDetail ? View : Pressable;
  // feedItem이 랜더링 된 위치가 상세페이지가 아닐때 이동

  return (
    <ContainerComponent style={styles.container} onPress={handlePressFeed}>
      <View style={styles.contentContainer}>
        <Profile
          onPress={() => { }}
          imageUri={post.author.imageUri}
          nickname={post.author.nickname}
          createdAt={post.createdAt}
          option={
            isUsedInDetail && auth.id === post.author.id && (
              <Ionicons name="ellipsis-vertical" size={24} color={colors.BLACK} onPress={handlePressOption} />
            )
          }
        />
        <Text style={styles.title}>{post.title}</Text>
        <Text numberOfLines={3} style={styles.description}>
          {post.description}
        </Text>
      </View>
      {/* 하단 메뉴*/}
      <View style={styles.menuContainer}>
        {/* 좋아요 버튼 영역*/}
        <Pressable style={styles.menu}>
          <Octicons
            name={isLiked ? "heart-fill" : "heart"}
            size={16}
            color={isLiked ? colors.ORANGE_600 : colors.BLACK}
          />
          <Text style={isLiked ? styles.activeMenuText : styles.menuText}>
            {post.likes?.length || "좋아요"}
          </Text>
        </Pressable>
        {/* 댓글 버튼 영역*/}
        <Pressable style={styles.menu}>
          <MaterialCommunityIcons
            name="comment-processing-outline"
            size={16}
            color={colors.BLACK}
          />
          <Text style={styles.menuText}>{post.commentCount || "댓글"}</Text>
        </Pressable>
        {/* 조회수 버튼 영역*/}
        <Pressable style={styles.menu}>
          <Ionicons name="eye-outline" size={16} color={colors.BLACK} />
          <Text style={styles.menuText}>{post.viewCount || "조회수"}</Text>
        </Pressable>
      </View>
      {/* 하단 메뉴*/}
    </ContainerComponent>
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
});

export default FeedItem;
