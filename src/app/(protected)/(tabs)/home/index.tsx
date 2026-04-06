import { colors } from "@/constants";
import { useGetInfinitePosts } from "@/hooks/queries/post/usePost";
import { Post } from "@/types";
import { useScrollToTop } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import React, { useRef } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeedItem from "@/components/FeedItem/FeedItem";
import RefetchingOverlay from "@/components/RefetchingOverlay/RefetchingOverlay";

export default function HomeScreen() {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useGetInfinitePosts();

  const ref = useRef<FlatList | null>(null);
  useScrollToTop(ref);

  const feedData = posts?.pages.flat() ?? [];
  const isEmpty = feedData.length === 0;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.feedContainer}>
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
      <Pressable
        style={styles.writeButton}
        onPress={() => router.push("/post" as Href)}
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
