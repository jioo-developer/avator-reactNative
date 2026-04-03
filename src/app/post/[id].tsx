import CommentItem from "@/app/post/_components/CommentItem";
import PostCommentInput, {
  type ReplyTarget,
} from "@/app/post/_components/PostCommentInput";
import AuthRoute from "@/components/AuthRoute";
import FeedItem from "@/components/FeedItem";
import { colors } from "@/constants";
import { useGetPost } from "@/hooks/queries/useGetPost";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isPending, isError } = useGetPost(Number(id));
  const scrollRef = useRef<ScrollView | null>(null);
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);

  if (isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.ORANGE_600} />
      </View>
    );
  }
  if (isError || !post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>게시글을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <AuthRoute>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.body}>
          <KeyboardAwareScrollView
            innerRef={(r) => {
              scrollRef.current = r;
            }}
            style={styles.scroll}
            contentContainerStyle={styles.awareScrollViewContainer}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
          >
            <View>
              <FeedItem post={post} isDetail />
              <Text style={styles.commentCount}>댓글 {post.commentCount}개</Text>
              {post.comments!.map((comment) => (
                <View key={comment.id}>
                  <CommentItem
                    comment={comment}
                    onReply={() =>
                      setReplyTo({
                        id: comment.id,
                        nickname: comment.user.nickname,
                      })
                    }
                  />
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      isReply
                      onReply={() =>
                        setReplyTo({
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
          <PostCommentInput
            postId={post.id}
            scrollRef={scrollRef}
            replyTo={replyTo}
            onDismissReply={() => setReplyTo(null)}
          />
        </View>
      </SafeAreaView>
    </AuthRoute>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.GRAY_200,
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.WHITE,
  },
  errorText: {
    fontSize: 16,
    color: colors.GRAY_700,
  },
  commentCount: {
    marginTop: 12,
    backgroundColor: colors.WHITE,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "bold",
  },

});
