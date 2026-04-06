import { colors } from "@/constants";
import { useGetInfinitePosts } from "@/hooks/queries/post/usePost";
import { Post } from "@/types";
import { useScrollToTop } from "@react-navigation/native";
import React, { useRef } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import FeedItem from "../FeedItem/FeedItem";
import RefetchingOverlay from "../RefetchingOverlay/RefetchingOverlay";

function FeedList() {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useGetInfinitePosts();

  const ref = useRef<FlatList | null>(null);
  useScrollToTop(ref)

  const feedData = posts?.pages.flat() ?? [];
  const isEmpty = feedData.length === 0;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };


  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={feedData}
        renderItem={({ item }) => <FeedItem post={item} />}
        keyExtractor={(item: Post) => String(item.id)}
        contentContainerStyle={[
          styles.contentContainer,
          isEmpty && styles.emptyContentContainer,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Image
              source={require("@/assets/images/default-avatar.png")}
              style={styles.emptyAvatar}
            />
            <Text style={styles.emptyText}>게시글이 없습니다</Text>
          </View>
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={refetch}
      />

      {isRefetching && <RefetchingOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});

export default FeedList;
