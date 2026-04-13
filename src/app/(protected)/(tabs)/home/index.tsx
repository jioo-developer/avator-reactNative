import { FeedItem, RefetchingOverlay, SearchBar } from "@/components";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { useGetInfinitePosts } from "@/hooks/queries/post/usePost";
import { Post } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useScrollToTop } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Empty from "./empty";

export default function HomeScreen() {
  const [query, setQuery] = useState(""); // 상단 헤더 검색바에 사용 될 상태

  const { auth } = useAuth();
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isRefetching,
    refetch,
  } = useGetInfinitePosts(query); // 게시글 infinite query

  const ref = useRef<FlatList | null>(null);

  useScrollToTop(ref);

  const feedData = posts?.pages.flat() ?? [];
  const showInitialLoading = isPending && feedData.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar onSubmit={setQuery} />
      <View style={styles.feedContainer}>
        <FlatList
          ref={ref}
          data={feedData}
          renderItem={({ item }) => {
            const isLiked =
              item.likes?.some((like) => Number(like.userId) === Number(auth.id)) ?? false;
            // isLiked: 게시글이 좋아요 되어있는지 여부
            return (
              <FeedItem
                post={item}
                variant="list"
                isLiked={isLiked}
                onPressContent={() =>
                  router.push({ pathname: "/detail/[id]", params: { id: String(item.id) } })
                }
              />
            );
          }}
          // return feedItem
          keyExtractor={(item: Post) => String(item.id)}
          // keyExtractor: 게시글 아이템의 고유 키를 반환하는 함수
          contentContainerStyle={[
            styles.contentContainer,
            feedData.length === 0 && styles.emptyContentContainer,
          ]}
          // contentContainerStyle: 게시글 목록의 스타일
          ListEmptyComponent={showInitialLoading ? null : <Empty />}
          // ListEmptyComponent: 게시글 목록이 비어있을 때 표시할 컴포넌트
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          // onEndReached: 게시글 목록이 끝에 도달했을 때 호출되는 함수
          onEndReachedThreshold={0.5}
          // onEndReachedThreshold: 게시글 목록이 끝에 도달했을 때 호출되는 함수의 임계값
          refreshing={isRefetching}
          // refreshing: 게시글 목록을 새로고침할 때 표시할 컴포넌트
          onRefresh={refetch}
        />

        {showInitialLoading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
          </View>
        )}
        {isRefetching && <RefetchingOverlay />}
        {/* RefetchingOverlay: 게시글 목록을 새로고침할 때 표시할 컴포넌트 */}
      </View>
      {/* 게시글 작성 버튼 */}
      <Pressable
        style={styles.writeButton}
        onPress={() => router.push("/post")}
      >
        <Ionicons name="pencil" size={32} color={colors.WHITE} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  feedContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 12,
    backgroundColor: colors.GRAY_200,
    gap: 12,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  loadingWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  emptyAvatar: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.GRAY_700,
  },
  writeButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: colors.ORANGE_600,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
});
