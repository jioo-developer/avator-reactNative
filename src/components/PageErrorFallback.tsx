import { colors } from "@/constants";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import type { FallbackProps } from "react-error-boundary";
import { Pressable, StyleSheet, Text, View } from "react-native";

type PageErrorFallbackProps = FallbackProps & {
  message?: string;
};

export function PageErrorFallback({
  resetErrorBoundary,
  message = "문제가 발생했습니다.",
}: PageErrorFallbackProps) {
  const { reset } = useQueryErrorResetBoundary();

  const onRetry = () => {
    reset();
    resetErrorBoundary();
  };

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>다시 시도</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.WHITE,
    paddingHorizontal: 24,
    gap: 16,
  },
  message: {
    fontSize: 16,
    color: colors.GRAY_700,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.ORANGE_600,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
});
