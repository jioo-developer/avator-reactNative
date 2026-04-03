import FixedBottomCTA from "@/components/FixedBottomCTA";
import { useGetPost } from "@/hooks/queries/useGetPost";
import useUpdatePost from "@/hooks/queries/useUpdatePost";
import { ImageUri } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TitleInput from "../_components/TitleInput";
import DescriptionInput from "../_components/Description";

type FormValues = {
    title: string;
    description: string;
    imageUris: ImageUri[];
}

export default function PostUpdateScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: post } = useGetPost(Number(id))
    const updatePostMutation = useUpdatePost();
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