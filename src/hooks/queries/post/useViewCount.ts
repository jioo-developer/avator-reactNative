import queryClient from "@/api/config/queryClient";
import { POSTS_QUERY_KEY, queryKeys } from "@/constants";
import { useIncreasePostView } from "@/hooks/queries/post/usePost";
import type { Post } from "@/types";
import type { InfiniteData } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";

// "게시글 상세" 쿼리에서 사용할 queryKey를 만드는 유틸
const getPostQueryKey = (postId: number) =>
  [queryKeys.POST, queryKeys.GET_POST, postId] as const;

/**
 * - 서버가 viewCount를 내려주면: 그 값을 그대로 사용 (가장 정확)
 * - 서버 응답에 viewCount가 없으면: 캐시에 있는 값에서 +1 (화면을 바로 갱신하기 위한 임시값)
 */
function getNextViewCount(input: { current?: number; server?: unknown }) {
  const serverViewCount =
    typeof input.server === "number" ? input.server : undefined;
  return typeof serverViewCount === "number"
    ? serverViewCount
    : (input.current ?? 0) + 1;
}

/**
 * 게시글 상세 화면에서 "조회수 증가"를 처리하는 훅.
 * 동작 요약
 * - 화면이 포커스될 때(상세 화면이 보일 때) 조회수 증가 API 호출
 * - 성공하면 캐시를 바로 갱신해서 UI에 즉시 반영
 * - 이후 상세 쿼리는 무효화해서(=다음에) 최신 데이터를 다시 받도록 함
 *
 * @param postId - 조회수를 증가시킬 게시글 ID
 */
export function usePostDetailViewCount(postId: number) {
  const { mutate: increaseView } = useIncreasePostView();

  // "한 번의 포커스" 동안 조회수 증가를 1회만 실행하기 위한 플래그
  // (환경에 따라 useFocusEffect 콜백이 중복 호출될 수 있어서 안전장치가 필요함)
  const hasCountedOnFocusRef = useRef(false);

  // 화면이 포커스될 때마다 실행 (탭 전환, 뒤로가기 후 재진입 등)
  useFocusEffect(
    useCallback(() => {
      // 이미 이번 포커스에서 처리했다면 중복 호출 방지
      if (hasCountedOnFocusRef.current) return;
      hasCountedOnFocusRef.current = true;

      increaseView(postId, {
        onSuccess: (res) => {
          const postQueryKey = getPostQueryKey(postId);

          // 1) "게시글 상세" 캐시를 바로 업데이트해서 UI에 즉시 반영
          queryClient.setQueryData<Post>(postQueryKey, (prev) => {
            if (!prev) return prev;
            const nextViewCount = getNextViewCount({
              current: prev.viewCount,
              server: res?.viewCount,
            });
            return { ...prev, viewCount: nextViewCount };
          });

          // 2) "피드 목록(무한 스크롤)" 캐시에서도 동일 게시글의 조회수를 함께 맞춤
          queryClient.setQueryData<InfiniteData<Post[]>>(
            POSTS_QUERY_KEY,
            (prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                pages: prev.pages.map((posts) =>
                  posts.map((post) => {
                    // 다른 게시글은 그대로 둠
                    if (post.id !== postId) return post;
                    // 대상 게시글만 조회수 업데이트
                    return {
                      ...post,
                      viewCount: getNextViewCount({
                        current: post.viewCount,
                        server: res?.viewCount,
                      }),
                    };
                  })
                ),
              };
            }
          );

          // 3) 상세 쿼리는 무효화해서(=다음에) 댓글 등 최신 데이터를 다시 받아오게 함
          queryClient.invalidateQueries({ queryKey: postQueryKey });
        },
      });

      // 포커스가 풀리면 플래그를 초기화해서, 다음 포커스에서 다시 카운트할 수 있게 함
      return () => {
        hasCountedOnFocusRef.current = false;
      };
    }, [increaseView, postId])
  );

  // 화면에서 완전히 나갈 때(언마운트) 캐시를 정리
  useEffect(() => {
    return () => {
      // 상세 쿼리 캐시 제거 (재진입 시 오래된 데이터가 잠깐 보이는 현상 방지)
      queryClient.removeQueries({
        queryKey: getPostQueryKey(postId),
      });
      // 피드 목록 캐시 무효화 → 목록으로 돌아갔을 때 변경된 조회수 반영
      queryClient.invalidateQueries({
        queryKey: POSTS_QUERY_KEY,
      });
    };
  }, [postId]);
}