import { FixedBottomCTA } from "@/components";
import { useCreatePost } from "@/hooks/queries/post/usePost";
import { ImageUri } from "@/types";
import { dedupeImageUris } from "@/utils/ImageUtils";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DescriptionInput from "./_components/Description";
import ImagePreviewList from "./_components/ImagePreviewList";
import PostWriteFooter from "./_components/PostWriteFooter";
import TitleInput from "./_components/TitleInput";

type FormValues = {
    title: string;
    description: string;
    imageUris: ImageUri[];
}

export default function WriteScreen() {
    const createPostMutation = useCreatePost();
    const [isUploadingImages, setIsUploadingImages] = React.useState(false);

    const postForm = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            imageUris: [],
        },
    });

    const onSubmit = (formValues: FormValues) => {
        createPostMutation.mutate({
            ...formValues,
            imageUris: dedupeImageUris(formValues.imageUris) as ImageUri[],
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
                label="게시글 생성"
                onPress={postForm.handleSubmit(onSubmit)}
                disabled={isUploadingImages || createPostMutation.isPending}
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
