import CommentInput, {
  type ReplyParent,
} from "@/app/(protected)/post/_comment/CommentInput";
import CommentItem from "@/app/(protected)/post/_comment/CommentItem";
import FeedItem from "@/components/FeedItem";
import { colors } from "@/constants";
import { useGetPost } from "@/hooks/queries/post/usePost";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function PostDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isPending, isError } = useGetPost(Number(id));
  const scrollRef = useRef<ScrollView | null>(null);
  // 댓글 등록 성공 시 scrollToEnd로 목록 맨 아래(새 글 위치)로 스크롤
  const [replyParent, setReplyParent] = useState<ReplyParent | null>(null); // 댓글 답변 대상

  useLayoutEffect(() => {
    if (post?.title) {
      navigation.setOptions({ title: post.title });
      return;
    }

    if (!isPending && (isError || !post)) {
      navigation.setOptions({ title: "" });
      return;
    }

    navigation.setOptions({ title: "" });
  }, [navigation, post, isPending, isError]);

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
          <View>
            {/* 게시글 */}
            <FeedItem post={post} isUsedInDetail />
            {/* 댓글 목록 */}
            {post.comments!.map((comment) => (
              <View key={comment.id}>
                <CommentItem
                  comment={comment}
                  onReply={() =>
                    setReplyParent({
                      id: comment.id,
                      nickname: comment.user.nickname,
                    })
                    //  CommentInput에 replyParent로 넘길 "답글 대상" 설정
                  }
                />
                {/* 답글 목록 */}
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    isReply // 대댓글 여부 표시
                    onReply={() =>
                      setReplyParent({
                        id: reply.id,
                        nickname: reply.user.nickname,
                      })
                      //  CommentInput에 replyParent로 넘길 "답글 대상" 설정
                    }
                  />
                ))}
              </View>
            ))}
          </View>
        </KeyboardAwareScrollView>
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
