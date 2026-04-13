import { FixedBottomCTA } from "@/components";
import { useCreatePost } from "@/hooks/queries/post/usePost";
import { ImageUri, VoteOption } from "@/types";
import { dedupeImageUris, removeImage } from "@/utils/ImageUtils";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DescriptionInput from "../../../components/_pageComponents/post/DescriptionInput";
import ImagePreviewList from "../../../components/_pageComponents/post/ImagePreviewList";
import PostFooter from "../../../components/_pageComponents/post/PostFooter/PostFooter";
import TitleInput from "../../../components/_pageComponents/post/TitleInput";
import VoteAttached from "../../../components/_pageComponents/post/vote/VoteAttached";
import VoteModal from "../../../components/_pageComponents/post/vote/VoteModal";

type FormValues = {
    title: string;
    description: string;
    imageUris: ImageUri[];
    isVoteOpen: boolean;
    voteOptions: VoteOption[];
}

export default function WriteScreen() {
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const createPostMutation = useCreatePost();

    const postForm = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            imageUris: [],
            isVoteOpen: false,
            voteOptions: [],
        },
    });

    const onSubmit = (formValues: FormValues) => {
        createPostMutation.mutate({
            ...formValues,
            imageUris: dedupeImageUris(formValues.imageUris) as ImageUri[],
        });
    };

    const imageUris = postForm.watch("imageUris");

    return (
        <FormProvider {...postForm}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="always"
            >
                <TitleInput />
                <DescriptionInput />
                <VoteAttached />
                <VoteModal />
                <View style={styles.mediaSection}>
                    <PostFooter onUploadingChange={setIsUploadingImages} />
                    {imageUris.length > 0 && (
                        <ImagePreviewList
                            imageUris={imageUris}
                            variant="thumbnail"
                            editable
                            onRemove={(uri) => removeImage(postForm, uri)}
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
