import InputField from "@/components/InputField";
import { colors } from "@/constants";
import useCreateComment from "@/hooks/queries/useCreateComment";
import { Ionicons } from "@expo/vector-icons";
import React, { type RefObject, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ReplyTarget = { id: number; nickname: string };

export interface PostCommentInputProps {
  postId: number;
  scrollRef?: RefObject<ScrollView | null>;
  replyTo?: ReplyTarget | null;
  onDismissReply?: () => void;
  placeholder?: string;
  submitLabel?: string;
}

function PostCommentInput({
  postId,
  scrollRef,
  replyTo = null,
  onDismissReply,
  placeholder = "댓글을 입력하세요",
  submitLabel = "등록",
}: PostCommentInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const createComment = useCreateComment();

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || createComment.isPending) return;
    createComment.mutate(
      {
        postId,
        content: trimmed,
        ...(replyTo ? { parentCommentId: replyTo.id } : {}),
      },
      {
        onSuccess: () => {
          setText("");
          onDismissReply?.();
          scrollRef?.current?.scrollToEnd({ animated: true });
        },
      },
    );
  };

  const canSubmit = Boolean(text.trim()) && !createComment.isPending;

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      {replyTo ? (
        <View style={styles.replyBanner}>
          <Text style={styles.replyBannerText} numberOfLines={1}>
            {replyTo.nickname}님에게 답글
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onDismissReply}
            hitSlop={10}
            style={styles.replyBannerClose}
          >
            <Ionicons name="close" size={22} color={colors.GRAY_600} />
          </Pressable>
        </View>
      ) : null}
      <View style={styles.inputRow}>
      <View style={styles.inputWrap}>
        <InputField
          placeholder={replyTo ? "답글을 입력하세요" : placeholder}
          value={text}
          onChangeText={setText}
          variant="filled"
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        disabled={!canSubmit}
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.submitBtn,
          !canSubmit && styles.submitBtnDisabled,
          pressed && canSubmit && styles.submitBtnPressed,
        ]}
      >
        <Text style={[styles.submitLabel, !canSubmit && styles.submitLabelDisabled]}>
          {submitLabel}
        </Text>
      </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.WHITE,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.GRAY_200,
  },
  replyBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.GRAY_100,
    gap: 8,
  },
  replyBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.GRAY_700,
  },
  replyBannerClose: {
    padding: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    minWidth: 0,
  },
  submitBtn: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.ORANGE_600,
  },
  submitBtnPressed: {
    opacity: 0.88,
  },
  submitBtnDisabled: {
    backgroundColor: colors.GRAY_200,
  },
  submitLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.WHITE,
  },
  submitLabelDisabled: {
    color: colors.GRAY_500,
  },
});

export default PostCommentInput;
