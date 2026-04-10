import { InputField } from "@/components";
import { colors } from "@/constants";
import { useCreateComment } from "@/hooks/queries/post/useComment";
import { Ionicons } from "@expo/vector-icons";
import React, { type RefObject, useEffect, useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ReplyParent = { id: number; nickname: string };

export interface replyInputProps {
  postId: number;
  scrollRef?: RefObject<ScrollView | null>;
  replyParent?: ReplyParent | null;
  onCancelReply?: () => void;
}

function ReplyInput({
  postId,
  scrollRef,
  replyParent = null,
  onCancelReply,
}: replyInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { mutate: createComment, isPending } = useCreateComment();

  const trimmed = text.trim();
  const disabled = !trimmed || isPending;

  const handleSubmit = () => {
    if (!trimmed) return;

    createComment(
      {
        postId,
        content: trimmed,
        ...(replyParent && { parentCommentId: replyParent.id }),
      },
      {
        onSuccess: () => {
          setText("");
          onCancelReply?.();
          Keyboard.dismiss();
          setKeyboardHeight(0);
          setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 0);
        },
      }
    );
  };

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => scrollRef?.current?.scrollToEnd({ animated: true }), 0);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [scrollRef]);

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          bottom: keyboardHeight > 0 ? keyboardHeight + 12 : 0,
        },
      ]}
    >
      {replyParent && (
        <View style={styles.replyBanner}>
          <Text style={styles.replyBannerText} numberOfLines={1}>
            {replyParent.nickname}님에게 답글
          </Text>
          <Pressable onPress={onCancelReply} hitSlop={10}>
            <Ionicons name="close" size={22} color={colors.GRAY_600} />
          </Pressable>
        </View>
      )}

      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <InputField
            placeholder={replyParent ? "답글을 입력하세요" : "댓글을 입력하세요"}
            value={text}
            onChangeText={setText}
            variant="filled"
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            onFocus={() => scrollRef?.current?.scrollToEnd({ animated: true })}
          />
        </View>

        <Pressable
          disabled={disabled}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitBtn,
            disabled && styles.submitBtnDisabled,
            pressed && !disabled && styles.submitBtnPressed,
          ]}
        >
          <Text
            style={[
              styles.submitLabel,
              disabled && styles.submitLabelDisabled,
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

export default ReplyInput;