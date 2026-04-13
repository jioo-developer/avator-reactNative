import {
  CreatePostDto,
  CreateVoteDto,
  Post,
  RequestUpdatePost,
  VoteOption,
} from "@/types";
import axiosInstance from "./config/axiosInstance";

// 게시글 생성
async function createPost(body: CreatePostDto) {
  const { data } = await axiosInstance.post("/posts", body);
  return data;
}

// 게시글 목록 조회
async function getPosts(page: number = 1, query?: string): Promise<Post[]> {
  const normalizedQuery = (query ?? "").trim(); // 검색어 정규화

  const endpoint = normalizedQuery.length
    ? `/posts/search?query=${encodeURIComponent(normalizedQuery)}&page=${page}`
    : `/posts?page=${page}`;
  // 검색어 있으면 검색 엔드포인트, 없으면 전체 게시글 엔드포인트
  const { data } = await axiosInstance.get(endpoint); // 게시글 목록 조회
  return data;
}

// 게시글 상세 조회
async function getPost(id: number): Promise<Post> {
  const { data } = await axiosInstance.get(`/posts/${id}`);
  return data;
}

// 게시글 수정
async function updatePost({ id, body }: RequestUpdatePost): Promise<number> {
  const { data } = await axiosInstance.patch(`/posts/${id}`, body);
  return data;
}

// 게시글 삭제
async function deletePost(id: number) {
  const { data } = await axiosInstance.delete(`/posts/${id}`);
  return data;
}

// 게시글 조회수 증가
async function increasePostView(
  id: number,
): Promise<{ viewCount: number | null }> {
  const { data } = await axiosInstance.post(`/posts/${id}/view`);
  return data;
}

// 게시글 좋아요 토글 (서버: POST /likes/:postId)
async function togglePostLike(postId: number): Promise<number> {
  const { data } = await axiosInstance.post(`/likes/${postId}`);
  return data;
}

// 좋아요 누른 게시글 조회
async function getLikedPosts(page = 1): Promise<Post[]> {
  const { data } = await axiosInstance.get(`/likes?page=${page}`);

  return data;
}

// 이미지 업로드
async function uploadImages(body: FormData): Promise<string[]> {
  const { data } = await axiosInstance.post("/images", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

// 투표 생성
async function createVote({
  postId,
  voteOptionId,
}: CreateVoteDto): Promise<{ postId: number; voteOption: VoteOption }> {
  const { data } = await axiosInstance.post(
    `/posts/${postId}/vote/${voteOptionId}`,
  );

  return data;
}

export {
  createPost,
  createVote,
  deletePost,
  getLikedPosts,
  getPost,
  getPosts,
  increasePostView,
  togglePostLike,
  updatePost,
  uploadImages
};

