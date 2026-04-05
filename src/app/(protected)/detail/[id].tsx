import Content from "./content";
import { PageErrorFallback } from "@/components";
import { colors } from "@/constants";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function PostDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const postId = Number(idParam);
  const hasValidId = Number.isFinite(postId) && postId > 0;

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
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.ORANGE_600} />
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
