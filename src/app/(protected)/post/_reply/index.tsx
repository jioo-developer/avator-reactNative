import { InputField, Profile } from "@/components";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { useDeleteComment, useToggleCommentLike, useUpdateComment } from "@/hooks/queries/post/useComment";
import { Comment } from "@/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";

interface CommentItemProps {
  comment: Comment;
  postId: number;
  isReply?: boolean; // 답글임을 시각적으로 구분
  onReply?: () => void; // 답글 남기기 탭 시 호출
}

function CommentItem({
  comment,
  postId,
  isReply = false,
  onReply,
}: CommentItemProps) {
  const { auth } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const deleteComment = useDeleteComment();
  const toggleLike = useToggleCommentLike();
  const updateComment = useUpdateComment();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  useEffect(() => {
    if (!isEditing) setEditText(comment.content);
  }, [comment.content, isEditing]);

  const trimmedEditText = useMemo(() => editText.trim(), [editText]);
  const canSubmitEdit = trimmedEditText.length > 0 && trimmedEditText !== comment.content;

  const handlePressOption = () => {
    const options = ["수정", "삭제", "취소"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        tintColor: colors.PRIMARY,
        cancelButtonTintColor: colors.GRAY_700,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            setIsEditing(true);
            break;
          case destructiveButtonIndex:
            deleteComment.mutate({ commentId: comment.id, postId });
            break;
          case cancelButtonIndex:
            break;
          default:
            break;
        }
      },
    );
  };

  const showMenu = !comment.isDeleted && auth.id === comment.user.id;
  const likeCount = comment.likes?.length ?? 0;
  const isLiked = Boolean(comment.likes?.some((like) => like.userId === auth.id));
  const canLike = !comment.isDeleted;
  const canEdit = showMenu && !updateComment.isPending;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {/* isReply: 답글임을 시각적으로 구분 */}
        {isReply ? (
          <View style={styles.replyMarker} accessibilityLabel="답글">
            <Ionicons
              name="return-down-forward-outline"
              size={20}
              color={colors.GRAY_500}
            />
          </View>
        ) : null}
        <View style={styles.profileWrap}>
          <Profile
            onPress={() => { }}
            imageUri={comment.isDeleted ? "" : comment.user.imageUri}
            nickname={comment.isDeleted ? "(삭제)" : comment.user.nickname}
            createdAt={comment.createdAt}
            option={
              <View style={styles.optionRow}>
                <Pressable
                  accessibilityRole="button"
                  disabled={!canLike || toggleLike.isPending}
                  onPress={() => toggleLike.mutate({ commentId: comment.id, postId })}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.likeBtn,
                    pressed && canLike && styles.likeBtnPressed,
                    (!canLike || toggleLike.isPending) && styles.likeBtnDisabled,
                  ]}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={isLiked ? colors.ORANGE_600 : colors.GRAY_600}
                  />
                  <Text style={styles.likeCount}>{likeCount}</Text>
                </Pressable>

                {showMenu ? (
                  <Pressable onPress={handlePressOption} hitSlop={8} disabled={!canEdit}>
                    <Ionicons name="ellipsis-vertical" size={22} color={colors.BLACK} />
                  </Pressable>
                ) : null}
              </View>
            }
          />
        </View>
      </View>
      {/* 댓글 내용 노출 */}
      {isEditing ? (
        <View style={[styles.editWrap, isReply && styles.editWrapReply]}>
          <InputField
            value={editText}
            onChangeText={setEditText}
            placeholder="댓글을 수정하세요"
            variant="filled"
            selectionColor={colors.PRIMARY}
            cursorColor={colors.PRIMARY}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (!canSubmitEdit) return;
              updateComment.mutate(
                { id: comment.id, content: trimmedEditText, postId },
                {
                  onSuccess: () => {
                    Keyboard.dismiss();
                    setIsEditing(false);
                  },
                },
              );
            }}
          />
          <View style={styles.editActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                Keyboard.dismiss();
                setIsEditing(false);
                setEditText(comment.content);
              }}
              hitSlop={8}
              style={styles.editCancelBtn}
            >
              <Text style={styles.editCancelText}>취소</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={!canSubmitEdit}
              onPress={() => {
                if (!canSubmitEdit) return;
                updateComment.mutate(
                  { id: comment.id, content: trimmedEditText, postId },
                  {
                    onSuccess: () => {
                      Keyboard.dismiss();
                      setIsEditing(false);
                    },
                  },
                );
              }}
              hitSlop={8}
              style={({ pressed }) => [
                styles.editSubmitBtn,
                !canSubmitEdit && styles.editSubmitBtnDisabled,
                pressed && canSubmitEdit && styles.editSubmitBtnPressed,
              ]}
            >
              <Text
                style={[
                  styles.editSubmitText,
                  !canSubmitEdit && styles.editSubmitTextDisabled,
                ]}
              >
                완료
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text
          style={[
            styles.body,
            isReply && styles.bodyReply,
            comment.isDeleted && styles.bodyDeleted,
          ]}
        >
          {comment.isDeleted ? "삭제된 댓글 입니다." : comment.content}
        </Text>
      )}
      {/* 답글 남기기 버튼 노출 */}
      {!comment.isDeleted && onReply ? (
        <Pressable
          onPress={onReply}
          hitSlop={8}
          style={[
            styles.replyAction,
            isEditing && styles.replyActionEditing,
            styles.replyActionFirst,
            isReply && styles.replyActionFirstReply,
          ]}
        >
          <Text style={styles.replyActionLabel}>답글 남기기</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.GRAY_200,
    backgroundColor: colors.WHITE,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  replyMarker: {
    width: 22,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileWrap: {
    flex: 1,
    minWidth: 0,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeBtnPressed: {
    opacity: 0.75,
  },
  likeBtnDisabled: {
    opacity: 0.4,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.GRAY_700,
  },
  body: {
    marginTop: 6,
    marginLeft: 58,
    fontSize: 15,
    lineHeight: 22,
    color: colors.BLACK,
  },
  bodyReply: {
    marginLeft: 90,
  },
  bodyDeleted: {
    color: colors.GRAY_500,
  },
  editWrap: {
    marginTop: 6,
    marginLeft: 58,
    gap: 8,
  },
  editWrapReply: {
    marginLeft: 90,
  },
  editActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  editCancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  editCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.GRAY_700,
  },
  editSubmitBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.ORANGE_600,
  },
  editSubmitBtnPressed: {
    opacity: 0.85,
  },
  editSubmitBtnDisabled: {
    backgroundColor: colors.GRAY_200,
  },
  editSubmitText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.WHITE,
  },
  editSubmitTextDisabled: {
    color: colors.GRAY_500,
  },
  replyAction: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  replyActionEditing: {
    marginTop: 0,
  },
  replyActionFirst: {
    marginLeft: 58,
  },
  replyActionFirstReply: {
    marginLeft: 90,
  },
  replyActionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ORANGE_600,
  },
});
