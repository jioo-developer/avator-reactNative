import Profile from "@/components/Profile";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/useAuth";
import useDeleteComment from "@/hooks/queries/useDeleteComment";
import { Comment } from "@/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

const AVATAR = 50;
const AVATAR_GAP = 8;
const TEXT_INSET = AVATAR + AVATAR_GAP;
const REPLY_RAIL = 3;
const REPLY_GAP = 10;

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onReply?: () => void;
}

function CommentItem({ comment, isReply = false, onReply }: CommentItemProps) {
  const { auth } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const deleteComment = useDeleteComment();

  const bodyInset = (isReply ? REPLY_RAIL + REPLY_GAP : 0) + TEXT_INSET;

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
        {isReply ? <View style={styles.replyRail} /> : null}
        <View style={styles.profileWrap}>
          <Profile
            onPress={() => {}}
            imageUri={comment.isDeleted ? "" : comment.user.imageUri}
            nickname={comment.isDeleted ? "(삭제)" : comment.user.nickname}
            createdAt={comment.createdAt}
            option={
              showMenu ? (
                <Pressable onPress={handlePressOption} hitSlop={8}>
                  <Ionicons name="ellipsis-vertical" size={22} color={colors.BLACK} />
                </Pressable>
              ) : undefined
            }
          />
        </View>
      </View>
      <Text
        style={[
          styles.body,
          { marginLeft: bodyInset },
          comment.isDeleted && styles.bodyDeleted,
        ]}
      >
        {displayBody}
      </Text>
      {!comment.isDeleted && onReply ? (
        <Pressable
          onPress={onReply}
          hitSlop={8}
          style={[styles.replyAction, { marginLeft: bodyInset }]}
        >
          <Text style={styles.replyActionLabel}>답글</Text>
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
    gap: REPLY_GAP,
  },
  replyRail: {
    width: REPLY_RAIL,
    marginTop: 10,
    alignSelf: "stretch",
    minHeight: 36,
    borderRadius: 2,
    backgroundColor: colors.GRAY_200,
  },
  profileWrap: {
    flex: 1,
    minWidth: 0,
  },
  body: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: colors.BLACK,
  },
  bodyDeleted: {
    color: colors.GRAY_500,
  },
  replyAction: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  replyActionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.GRAY_600,
  },
});
