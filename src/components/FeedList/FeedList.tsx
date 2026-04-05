import FeedItem from "@/components/FeedItem";
import { colors } from "@/constants";
import { useGetInfinitePosts } from "@/hooks/queries/post/usePost";
import { Post } from "@/types";
import { useScrollToTop } from "@react-navigation/native";
import React, { useRef } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

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

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };


  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={posts?.pages.flat()}
        renderItem={({ item }) => <FeedItem post={item} />}
        keyExtractor={(item: Post) => String(item.id)}
        contentContainerStyle={styles.contentContainer}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={refetch}
      />

      {isRefetching && (
        <View style={styles.refreshOverlay}>
          <View style={styles.refreshInner}>
            <Image
              source={require("@/assets/images/default-avatar.png")}
              style={styles.refreshImage}
            />
            <Text style={styles.refreshText}>새로고침 중...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  refreshImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  contentContainer: {
    paddingVertical: 12,
    backgroundColor: colors.GRAY_200,
    gap: 12,
  },
  refreshText: {
    fontSize: 16,
    color: colors.WHITE,
    marginBottom: 16,
  },
});

export default FeedList;
