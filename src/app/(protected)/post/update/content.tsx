import { FixedBottomCTA } from "@/components";
import { useGetPostSuspense, useUpdatePost } from "@/hooks/queries/post/usePost";
import { ImageUri } from "@/types";
import { dedupeImageUris, removeImage } from "@/utils/ImageUtils";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DescriptionInput from "../../../../components/_pageComponents/post/DescriptionInput";
import ImagePreviewList from "../../../../components/_pageComponents/post/ImagePreviewList";
import PostFooter from "../../../../components/_pageComponents/post/PostFooter/PostFooter";
import TitleInput from "../../../../components/_pageComponents/post/TitleInput";
import VoteAttached from "../../../../components/_pageComponents/post/vote/VoteAttached";

type FormValues = {
    title: string;
    description: string;
    isvoteAttached: boolean;
    imageUris: ImageUri[];
};

export default function Content({ postId }: { postId: number }) {
    const navigation = useNavigation();
    const { data: post } = useGetPostSuspense(postId);
    const [isUploadingImages, setIsUploadingImages] = useState(false); // 이미지 업로드 상태
    const { mutate: updatePostMutation, isPending } = useUpdatePost();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: post.title ?? "게시글 수정",
        });
    }, [navigation, post.title]);

    const postForm = useForm<FormValues>({
        defaultValues: {
            title: post.title || "",
            description: post.description || "",
            isvoteAttached: post.hasVote || false,
            imageUris: post.imageUris || [],
        },
    });

    const onSubmit = (formValues: FormValues) => {
        updatePostMutation({
            id: postId,
            body: {
                ...formValues,
                imageUris: dedupeImageUris(formValues.imageUris) as ImageUri[],
            },
        });
    };

    const imageUris = postForm.watch("imageUris");

    return (
        <FormProvider {...postForm}>
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <TitleInput />
                {/* 제목 입력 컴포넌트 */}
                <DescriptionInput />
                {/* 설명 입력 컴포넌트 */}
                <VoteAttached />
                <View style={styles.mediaSection}>
                    <PostFooter onUploadingChange={setIsUploadingImages} />
                    {/* 업로드 푸터 컴포넌트 */}
                    {imageUris.length > 0 && (
                        <ImagePreviewList
                            imageUris={imageUris}
                            variant="thumbnail"
                            editable
                            onRemove={(uri) => removeImage(postForm, uri)}
                            enableZoom
                        />
                    )}
                    {/* 이미지 미리보기 컴포넌트 */}
                </View>
            </KeyboardAwareScrollView>
            <FixedBottomCTA
                label="게시글 수정"
                onPress={postForm.handleSubmit(onSubmit)}
                disabled={isUploadingImages || isPending}
            />
        </FormProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
        gap: 16,
    },
    mediaSection: {
        gap: 8,
    },
});
