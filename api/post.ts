import { CreatePostDto, Post } from "@/types";
import axiosInstance from "./config/axios";

async function createPost(body: CreatePostDto) {
    const { data } = await axiosInstance.post("/posts", body);
    return data;
}


async function getPosts(page: number = 1): Promise<Post[]> {
    const { data } = await axiosInstance.get(`/posts?page=${page}`);
    return data;
}

export { createPost, getPosts };

