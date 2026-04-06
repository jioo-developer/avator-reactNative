import { CreateCommentDto } from "@/types";
import axiosInstance from "./config/axiosInstance";

async function createComment(body: CreateCommentDto) {
    const { data } = await axiosInstance.post("/comments", body);
    return data;
}

async function updateComment({ id, content }: { id: number; content: string }) {
    const { data } = await axiosInstance.patch(`/comments/${id}`, { content });
    return data;
}

async function deleteComment(id: number) {
    const { data } = await axiosInstance.delete(`/comments/${id}`);
    return data;
}

async function toggleCommentLike(commentId: number) {
    const { data } = await axiosInstance.post(`/comment-likes/${commentId}`);
    return data;
}

export { createComment, deleteComment, toggleCommentLike, updateComment };

