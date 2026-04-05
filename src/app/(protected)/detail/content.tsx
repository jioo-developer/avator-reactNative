import CommentItem from "@/app/(protected)/post/_reply";
import CommentInput, {
  type ReplyParent,
} from "@/app/(protected)/post/_reply/replyInput";
import { FeedItem } from "@/components";
import { colors } from "@/constants";
import { useGetPostSuspense } from "@/hooks/queries/post/usePost";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type ContentProps = {
  postId: number;
};

export default function Content({ postId }: ContentProps) {
  const navigation = useNavigation();
  const { data: post } = useGetPostSuspense(postId);
  const scrollRef = useRef<ScrollView | null>(null);
  const [replyParent, setReplyParent] = useState<ReplyParent | null>(null);

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
            <FeedItem post={post} isUsedInDetail />
            {/* 댓글 컴포넌트 */}
            {post.comments!.map((comment) => (
              <View key={comment.id}>
                <CommentItem
                  comment={comment}
                  onReply={() =>
                    setReplyParent({
                      id: comment.id,
                      nickname: comment.user.nickname,
                    })
                    // 답글 남기기 클릭 시 답글 입력창 대상 설정
                  }
                />
                {/* 답글 컴포넌트 */}
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    isReply // 대댓글임을 시각적으로 구분
                    onReply={() =>
                      setReplyParent({
                        id: reply.id,
                        nickname: reply.user.nickname,
                      })
                      // 답글 남기기 클릭 시 답글 입력창 대상 설정
                    }
                  />
                ))}
              </View>
            ))}
          </View>
        </KeyboardAwareScrollView>
        {/* 댓글 입력창 컴포넌트 */}
        <CommentInput
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
