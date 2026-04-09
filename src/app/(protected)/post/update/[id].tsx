import { FixedBottomCTA, PageErrorFallback, RefetchingOverlay } from "@/components";
import { useGetPostSuspense, useUpdatePost } from "@/hooks/queries/post/usePost";
import { ImageUri } from "@/types";
import { dedupeImageUris } from "@/utils/ImageUtils";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { Suspense, useLayoutEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DescriptionInput from "../_components/Description";
import ImagePreviewList from "../_components/ImagePreviewList";
import PostWriteFooter from "../_components/PostWriteFooter";
import TitleInput from "../_components/TitleInput";

type FormValues = {
    title: string;
    description: string;
    imageUris: ImageUri[];
}

export default function PostUpdateScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const postId = Number(id);
    const hasValidId = Number.isFinite(postId) && postId > 0;

    if (!hasValidId) {
        return null;
    }

    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary
                fallbackRender={(props) => (
                    <PageErrorFallback
                        {...props}
                        message="게시글을 불러오지 못했습니다."
                    />
                )}
            >
                <Suspense fallback={<RefetchingOverlay />}>
                    <PostUpdateContent postId={postId} />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    );
}

function PostUpdateContent({ postId }: { postId: number }) {
    const navigation = useNavigation();
    const { data: post } = useGetPostSuspense(postId);
    const updatePostMutation = useUpdatePost();
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: post.title ?? "게시글 수정",
        });
    }, [navigation, post.title]);

    const postForm = useForm<FormValues>({
        defaultValues: {
            title: post.title || "",
            description: post.description || "",
            imageUris: post.imageUris || [],
        },
    });

    const onSubmit = (formValues: FormValues) => {
        updatePostMutation.mutate({
            id: postId,
            body: {
                ...formValues,
                imageUris: dedupeImageUris(formValues.imageUris) as ImageUri[],
            },
        });
    };

    const imageUris = postForm.watch("imageUris");
    const removeImage = (uri: string) => {
        postForm.setValue(
            "imageUris",
            (postForm.getValues("imageUris") ?? []).filter((img) => img.uri !== uri),
            { shouldDirty: true, shouldTouch: true }
        );
    };

    return (
        <FormProvider {...postForm}>
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <TitleInput />
                <DescriptionInput />
                <View style={styles.mediaSection}>
                    <PostWriteFooter onUploadingChange={setIsUploadingImages} />
                    {imageUris.length > 0 && (
                        <ImagePreviewList
                            imageUris={imageUris}
                            variant="thumbnail"
                            editable
                            onRemove={removeImage}
                            enableZoom
                        />
                    )}
                </View>
            </KeyboardAwareScrollView>
            <FixedBottomCTA
                label="게시글 수정"
                onPress={postForm.handleSubmit(onSubmit)}
                disabled={isUploadingImages || updatePostMutation.isPending}
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