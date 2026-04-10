import { PageErrorFallback, RefetchingOverlay } from "@/components";
import { colors } from "@/constants";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { StyleSheet, Text, View } from "react-native";
import Content from "./content";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id); // 게시글 ID
  const hasValidId = Number.isFinite(postId) && postId > 0; // 게시글 ID가 유효한지 여부

  if (!hasValidId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>게시글을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary
        fallbackRender={(props) => (
          <PageErrorFallback
            {...props}
            message="게시글을 불러오지 못했습니다."
          />
        )}
      >
        <Suspense
          fallback={
            <View style={styles.suspenseFallback}>
              <RefetchingOverlay />
            </View>
          }
        >
          <Content postId={postId} />
        </Suspense>
      </ErrorBoundary>
    </QueryErrorResetBoundary>
  );
}

const styles = StyleSheet.create({
  suspenseFallback: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.WHITE,
  },
  errorText: {
    fontSize: 16,
    color: colors.GRAY_700,
  },
});
