import { InputField } from "@/components";
import { colors } from "@/constants";
import { useCreateComment } from "@/hooks/queries/post/useComment";
import { Ionicons } from "@expo/vector-icons";
import React, { type RefObject, useEffect, useMemo, useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ReplyParent = { id: number; nickname: string };

export interface CommentInputProps {
  postId: number;
  scrollRef?: RefObject<ScrollView | null>;
  replyParent?: ReplyParent | null;
  onCancelReply?: () => void;
}

function CommentInput({
  postId,
  scrollRef,
  replyParent = null,
  onCancelReply,
}: CommentInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const createComment = useCreateComment();

  const trimmedText = text.trim();
  const isEmpty = !trimmedText;

  const inputPlaceholder = replyParent ? "답글을 입력하세요" : "댓글을 입력하세요";

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // 키보드가 올라올 때 입력창이 가려지지 않도록 리스트를 끝으로 당김
      setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 0);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollRef]);

  // 키보드 높이에 따라 바의 위치를 조정
  const barBottomHeight = useMemo(() => {
    return keyboardHeight > 0 ? keyboardHeight + 12 : 0;
  }, [keyboardHeight]);

  // 댓글 등록 핸들러
  const handleSubmit = () => {
    if (isEmpty) return;

    const payload = {
      postId,
      content: trimmedText,
      ...(replyParent && { parentCommentId: replyParent.id }),
    };

    createComment.mutate(payload, {
      onSuccess: () => {
        setText("");
        onCancelReply && onCancelReply();
        Keyboard.dismiss();
        setKeyboardHeight(0);
        setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 0);
      },
    });
  };

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(insets.bottom, 12), bottom: barBottomHeight },
      ]}
    >
      {/* 답글 상태 배너 */}
      {replyParent && (
        <View style={styles.replyBanner}>
          <Text style={styles.replyBannerText} numberOfLines={1}>
            {replyParent.nickname}님에게 답글
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onCancelReply}
            hitSlop={10}
            style={styles.replyBannerClose}
          >
            <Ionicons name="close" size={22} color={colors.GRAY_600} />
          </Pressable>
        </View>
      )}

      {/* 입력 영역 */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <InputField
            placeholder={inputPlaceholder}
            value={text}
            onChangeText={setText}
            variant="filled"
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            onFocus={() => scrollRef?.current?.scrollToEnd({ animated: true })}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isEmpty}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitBtn,
            isEmpty && styles.submitBtnDisabled,
            // Pressable의 상태(pressed)와 입력값 유무(isEmpty)에 따라 스타일을 조건부로 합성
            // - 기본: submitBtn
            // - 입력이 비었을 때: submitBtnDisabled
            // - 눌리는 동안(비어있지 않을 때만): submitBtnPressed
            pressed && !isEmpty && styles.submitBtnPressed,
          ]}
        >
          <Text
            style={[
              styles.submitLabel,
              isEmpty && styles.submitLabelDisabled,
            ]}
          >
            등록
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

export default CommentInput;