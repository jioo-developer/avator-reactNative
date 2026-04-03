import { CreatePostDto, Post, RequestUpdatePost } from "@/types";
import axiosInstance from "./config/axios";

async function createPost(body: CreatePostDto) {
    const { data } = await axiosInstance.post("/posts", body);
    return data;
}


async function getPosts(page: number = 1): Promise<Post[]> {
    const { data } = await axiosInstance.get(`/posts?page=${page}`);
    return data;
}

async function getPost(id: number): Promise<Post> {
    const { data } = await axiosInstance.get(`/posts/${id}`);
    return data;
}

async function updatePost({ id, body }: RequestUpdatePost): Promise<number> {
    const { data } = await axiosInstance.put(`/posts/${id}`, body);
    return data;
}

async function deletePost(id: number) {
    const { data } = await axiosInstance.delete(`/posts/${id}`);
    return data;
}

export { createPost, deletePost, getPost, getPosts, updatePost };

