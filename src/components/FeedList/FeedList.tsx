import { colors } from "@/constants";
import { useGetInfinitePosts } from "@/hooks/queries/post/usePost";
import { Post } from "@/types";
import { useScrollToTop } from "@react-navigation/native";
import React, { useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
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
});

export default FeedList;
