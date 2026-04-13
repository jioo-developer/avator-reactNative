// useCommentItemController.ts
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";

import useAuth from "@/hooks/queries/auth/useAuth";
import {
    useDeleteComment,
    useToggleCommentLike,
    useUpdateComment,
} from "@/hooks/queries/post/useComment";

import { colors } from "@/constants";
import { Comment } from "@/types";

interface Props {
    comment: Comment;
    postId: number;
}

export function useReplyController({ comment, postId }: Props) {
    const { auth } = useAuth();
    const { showActionSheetWithOptions } = useActionSheet();

    const deleteComment = useDeleteComment();
    const toggleLike = useToggleCommentLike();
    const updateComment = useUpdateComment();

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    /** sync */
    useEffect(() => {
        if (!isEditing) setEditText(comment.content);
    }, [comment.content, isEditing]);

    /** derived */
    const trimmedEditText = useMemo(() => editText.trim(), [editText]);

    const canSubmitEdit =
        trimmedEditText.length > 0 &&
        trimmedEditText !== comment.content;

    const showMenu = !comment.isDeleted && auth.id === comment.user.id;
    const likeCount = comment.likes?.length ?? 0;

    const isLiked = Boolean(
        comment.likes?.some((like) => like.userId === auth.id)
    );

    const canLike = !comment.isDeleted;
    const canEdit = showMenu && !updateComment.isPending;

    /** actions */
    const handleLike = () => {
        if (!canLike) return;
        toggleLike.mutate({ commentId: comment.id, postId });
    };

    const handleDelete = () => {
        deleteComment.mutate({ commentId: comment.id, postId });
    };

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        Keyboard.dismiss();
        setIsEditing(false);
        setEditText(comment.content);
    };

    const handleSubmitEdit = () => {
        if (!canSubmitEdit) return;

        updateComment.mutate(
            { id: comment.id, content: trimmedEditText, postId },
            {
                onSuccess: () => {
                    Keyboard.dismiss();
                    setIsEditing(false);
                },
            }
        );
    };

    /** ActionSheet까지 controller에서 처리 */
    const handlePressOption = () => {
        const options = ["수정", "삭제", "취소"];

        showActionSheetWithOptions(
            {
                options,
                destructiveButtonIndex: 1,
                cancelButtonIndex: 2,
                tintColor: colors.PRIMARY,
                cancelButtonTintColor: colors.GRAY_700,
            },
            (selectedIndex?: number) => {
                switch (selectedIndex) {
                    case 0:
                        handleStartEdit();
                        break;
                    case 1:
                        handleDelete();
                        break;
                }
            }
        );
    };

    return {
        state: {
            isEditing,
            editText,
            likeCount,
            isLiked,
            showMenu,
            canLike,
            canEdit,
            canSubmitEdit,
        },
        actions: {
            setEditText,
            handleLike,
            handleCancelEdit,
            handleSubmitEdit,
            handlePressOption,
        },
    };
}