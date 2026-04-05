import { CreatePostDto, Post, RequestUpdatePost } from "@/types";
import axiosInstance from "./config/axiosInstance";

// 게시글 생성
async function createPost(body: CreatePostDto) {
    const { data } = await axiosInstance.post("/posts", body);
    return data;
}

// 게시글 목록 조회
async function getPosts(page: number = 1): Promise<Post[]> {
    const { data } = await axiosInstance.get(`/posts?page=${page}`);
    return data;
}

// 게시글 상세 조회
async function getPost(id: number): Promise<Post> {
    const { data } = await axiosInstance.get(`/posts/${id}`);
    return data;
}

// 게시글 수정
async function updatePost({ id, body }: RequestUpdatePost): Promise<number> {
    const { data } = await axiosInstance.put(`/posts/${id}`, body);
    return data;
}

// 게시글 삭제
async function deletePost(id: number) {
    const { data } = await axiosInstance.delete(`/posts/${id}`);
    return data;
}

export { createPost, deletePost, getPost, getPosts, updatePost };

