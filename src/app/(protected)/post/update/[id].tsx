import { FixedBottomCTA, PageErrorFallback, RefetchingOverlay } from "@/components";
import { useGetPostSuspense, useUpdatePost } from "@/hooks/queries/post/usePost";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ImageUri } from "@/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Suspense, useLayoutEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ErrorBoundary } from "react-error-boundary";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DescriptionInput from "../_components/Description";
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
        updatePostMutation.mutate({ id: postId, body: formValues });
    };

    return (
        <FormProvider {...postForm}>
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <TitleInput />
                <DescriptionInput />
            </KeyboardAwareScrollView>
            <FixedBottomCTA label="게시글 생성" onPress={postForm.handleSubmit(onSubmit)} />
        </FormProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
        gap: 16,
    },
});