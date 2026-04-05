import { Profile } from "@/components";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { useDeleteComment } from "@/hooks/queries/post/useComment";
import { Comment } from "@/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CommentItemProps {
  comment: Comment;
  /** true면 답글 행(들여쓰기·아이콘·여백). 상세 화면에서 `comment.replies`를 map할 때만 넘김. */
  isReply?: boolean;
  /** "답글 남기기" 탭 시 호출. 보통 부모(예: `detail/[id]`)가 `setReplyParent`로 입력창 대상(comment id·닉네임)을 설정 → `CommentInput`의 `replyParent`로 전달됨. */
  onReply?: () => void;
}

function CommentItem({
  comment,
  isReply = false,
  onReply,
}: CommentItemProps) {
  const { auth } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const deleteComment = useDeleteComment();

  const handlePressOption = () => {
    const options = ["삭제", "취소"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    showActionSheetWithOptions(
      { options, destructiveButtonIndex, cancelButtonIndex },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            deleteComment.mutate(comment.id);
            break;
          case cancelButtonIndex:
            break;
          default:
            break;
        }
      },
    );
  };

  const displayBody = comment.isDeleted ? "삭제된 댓글 입니다." : comment.content;
  const showMenu = !comment.isDeleted && auth.id === comment.user.id;

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
              showMenu ? (
                <Pressable onPress={handlePressOption} hitSlop={8}>
                  <Ionicons name="ellipsis-vertical" size={22} color={colors.BLACK} />
                </Pressable>
              ) : null
            }
          />
        </View>
      </View>
      <Text
        style={[
          styles.body,
          isReply && styles.bodyReply,
          comment.isDeleted && styles.bodyDeleted,
        ]}
      >
        {displayBody}
      </Text>
      {/* onReply 있을 때만 답글 액션 노출; 콜백은 상세 화면이 replyParent 상태를 갱신 */}
      {!comment.isDeleted && onReply ? (
        <Pressable
          onPress={onReply}
          hitSlop={8}
          style={[
            styles.replyAction,
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
  replyAction: {
    marginTop: 8,
    alignSelf: "flex-start",
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
