import CommentItem from "@/app/(protected)/detail/_reply";
import { FeedItem } from "@/components";
import ReplyInput, { ReplyParent } from "@/components/_pageComponents/post/reply/replyInput";
import { colors } from "@/constants";
import { useGetPostSuspense } from "@/hooks/queries/post/usePost";
import { usePostDetailViewCount } from "@/hooks/queries/post/useViewCount";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDetailActions } from "../../../hooks/detail/useDetailActions";

export default function Content({ postId }: { postId: number }) {
  const navigation = useNavigation();
  const { data: post } = useGetPostSuspense(postId); // 게시글 데이터 [id]
  const {
    isAuthor,
    isLiked,
    onPressOption,
    visibleCommentThreads,
  } = useDetailActions(post);

  const [replyParent, setReplyParent] = useState<ReplyParent | null>(null);

  const scrollRef = useRef<ScrollView | null>(null);

  usePostDetailViewCount(postId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: post.title });
  }, [navigation, post.title]);

  return (
    <View style={styles.safeArea}>
      <View style={styles.body}>
        <KeyboardAwareScrollView
          innerRef={(ref) => {
            scrollRef.current = ref;
          }}
          style={styles.scroll}
          contentContainerStyle={styles.awareScrollViewContainer}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
        >
          <View style={styles.wrapper}>
            {/* 게시글 컴포넌트 */}
            <FeedItem
              post={post}
              variant="detail"
              isLiked={isLiked}
              headerOption={
                isAuthor && (
                  <Ionicons
                    name="ellipsis-vertical"
                    size={24}
                    color={colors.BLACK}
                    onPress={onPressOption}
                  />
                )
              }
            />
            {/* 댓글 컴포넌트 */}
            {visibleCommentThreads.map(({ comment, visibleReplies }, threadIndex) => (
              <View key={comment.id ?? `comment-thread-${threadIndex}`}>
                <CommentItem
                  comment={comment}
                  postId={postId}
                  onReply={
                    !comment.isDeleted
                      ? () =>
                        setReplyParent({
                          id: comment.id,
                          nickname: comment.user.nickname,
                        })
                      : undefined
                  }
                />
                {/* 답글 컴포넌트 */}
                {visibleReplies.map((reply, replyIndex) => (
                  <CommentItem
                    key={reply.id ?? `reply-${comment.id ?? threadIndex}-${replyIndex}`}
                    comment={reply}
                    postId={postId}
                    isReply
                    onReply={() =>
                      setReplyParent({
                        id: reply.id,
                        nickname: reply.user.nickname,
                      })
                    }
                  />
                ))}
              </View>
            ))}
          </View>
        </KeyboardAwareScrollView>
        {/* 댓글 입력창 컴포넌트 */}
        <ReplyInput
          postId={post.id}
          scrollRef={scrollRef}
          replyParent={replyParent}
          onCancelReply={() => setReplyParent(null)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.GRAY_200,
  },
  wrapper: {
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.GRAY_200,
  },
  awareScrollViewContainer: {
    flexGrow: 1,
    backgroundColor: colors.GRAY_200,
    paddingBottom: 88,
  },
});
