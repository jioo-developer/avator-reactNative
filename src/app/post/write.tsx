import FixedBottomCTA from "@/components/FixedBottomCTA";
import useCreatePost from "@/hooks/queries/useCreatePost";
import { ImageUri } from "@/types";
import { useNavigation } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DescriptionInput from "./components/Description";
import TitleInput from "./components/TitleInput";

type FormValues = {
    title: string;
    description: string;
    imageUris: ImageUri[];
}

export default function WriteScreen() {
    const navigation = useNavigation();
    const createPostMutation = useCreatePost();

    const postForm = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            imageUris: [],
        },
    });

    const onSubmit = (formValues: FormValues) => {
        createPostMutation.mutate(formValues);
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