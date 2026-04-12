// CommentItem.tsx
import { InputField, Profile } from "@/components";
import { colors } from "@/constants";
import { Comment } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useReplyController } from "./useReplyController";

interface ReplyItemProps {
  comment: Comment;
  postId: number;
  isReply?: boolean;
  onReply?: () => void;
}

export default function ReplyItem({
  comment,
  postId,
  isReply = false,
  onReply,
}: ReplyItemProps) {
  const { state, actions } = useReplyController({
    comment,
    postId,
  });

  const {
    isEditing,
    editText,
    likeCount,
    isLiked,
    showMenu,
    canLike,
    canEdit,
    canSubmitEdit,
  } = state;

  const {
    setEditText,
    handleLike,
    handleCancelEdit,
    handleSubmitEdit,
    handlePressOption,
  } = actions;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {/* isReply: 답글임을 시각적으로 구분 */}
        {isReply && (
          <View style={styles.replyMarker} accessibilityLabel="답글">
            <Ionicons
              name="return-down-forward-outline"
              size={20}
              color={colors.GRAY_500}
            />
          </View>
        )}
        {/* 프로필 영역 */}
        <View style={styles.profileWrap}>
          <Profile
            onPress={() =>
              router.push(`/profile/${comment.user.id}` as Href)
            }
            imageUri={comment.isDeleted ? "" : comment.user.imageUri}
            nickname={comment.isDeleted ? "(삭제)" : comment.user.nickname}
            createdAt={comment.createdAt}
            option={
              <View style={styles.optionRow}>
                <Pressable
                  accessibilityRole="button"
                  disabled={!canLike}
                  onPress={handleLike}
                  style={({ pressed }) => [
                    styles.likeBtn,
                    pressed && styles.likeBtnPressed,
                    !canLike && styles.likeBtnDisabled,
                  ]}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={
                      isLiked ? colors.ORANGE_600 : colors.GRAY_600
                    }
                  />
                  <Text style={styles.likeCount}>{likeCount}</Text>
                </Pressable>

                {showMenu && (
                  <Pressable
                    onPress={handlePressOption}
                    disabled={!canEdit}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={22}
                      color={colors.BLACK}
                    />
                  </Pressable>
                )}
              </View>
            }
          />
        </View>
      </View>
      {/* 수정 영역 */}
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
            onSubmitEditing={handleSubmitEdit}
          />

          <View style={styles.editActions}>
            <Pressable onPress={handleCancelEdit}>
              <Text style={styles.editCancelText}>취소</Text>
            </Pressable>

            <Pressable
              disabled={!canSubmitEdit}
              onPress={handleSubmitEdit}
              style={[
                styles.editSubmitBtn,
                !canSubmitEdit && styles.editSubmitBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.editSubmitText,
                  !canSubmitEdit &&
                  styles.editSubmitTextDisabled,
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
          {comment.isDeleted
            ? "삭제된 댓글 입니다."
            : comment.content}
        </Text>
      )}

      {/* 답글 남기기 버튼 */}
      {!comment.isDeleted && onReply && (
        <Pressable
          onPress={onReply}
          style={[
            styles.replyAction,
            isReply && styles.replyActionFirstReply,
          ]}
        >
          <Text style={styles.replyActionLabel}>
            답글 남기기
          </Text>
        </Pressable>
      )}
    </View>
  );
}


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
