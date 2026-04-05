import { FixedBottomCTA } from "@/components";
import { useGetPost, useUpdatePost } from "@/hooks/queries/post/usePost";
import { ImageUri } from "@/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: post } = useGetPost(Number(id))
    const updatePostMutation = useUpdatePost();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: post?.title ?? "게시글 수정",
        });
    }, [navigation, post?.title]);

    const postForm = useForm<FormValues>({
        defaultValues: {
            title: post?.title || "",
            description: post?.description || "",
            imageUris: post?.imageUris || [],
        },
    });

    const onSubmit = (formValues: FormValues) => {
        updatePostMutation.mutate({ id: Number(id), body: formValues });
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