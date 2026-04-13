import { useUploadImages } from "@/hooks/queries/post/usePost";
import { ImageUri } from "@/types";
import { dedupeImageUris, getFormDataImages } from "@/utils/ImageUtils";
import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Alert } from "react-native";

const MAX_IMAGE_URIS = 5;

export function usePostFooter() {
  const { setValue, getValues } = useFormContext();
  const { mutate: uploadImages, isPending: isUploading } = useUploadImages();

  // 이미지 추가
  const addImageUris = useCallback(
    (imageUris: string[]) => {
      const current = (getValues("imageUris") ?? []) as ImageUri[];
      const merged = dedupeImageUris([
        ...current,
        ...imageUris.map((uri) => ({ uri })),
      ]);

      if (merged.length > MAX_IMAGE_URIS) {
        Alert.alert("최대 5개의 이미지를 추가할 수 있습니다.");
        return;
      }
      setValue("imageUris", merged, { shouldDirty: true, shouldTouch: true });
    },
    [getValues, setValue],
  );

  // 이미지 선택
  const handleOpenImagePicker = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
    });

    if (result.canceled) {
      return;
    }

    const formData = getFormDataImages("images", result.assets);
    uploadImages(formData, {
      onSuccess: (uris) => {
        addImageUris(uris);
      },
      onError: (error) => {
        Alert.alert(`이미지 업로드에 실패했습니다. ${error.message}`);
      },
    });
  }, [addImageUris, uploadImages]);

  return { addImageUris, handleOpenImagePicker, isUploading };
}
