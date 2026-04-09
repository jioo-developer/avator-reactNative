import { colors } from "@/constants";
import { useUploadImages } from "@/hooks/queries/post/usePost";
import { ImageUri } from "@/types";
import { dedupeImageUris, getFormDataImages } from "@/utils/ImageUtils";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PostWriteFooterProps = {
  includeSafeAreaBottomPadding?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
};

function PostWriteFooter({
  includeSafeAreaBottomPadding = false,
  onUploadingChange,
}: PostWriteFooterProps) {
  const inset = useSafeAreaInsets();
  const { mutate: uploadImages, isPending: isUploading } = useUploadImages();
  const { setValue, getValues } = useFormContext();

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const addImageUris = (imageUris: string[]) => {
    const current = (getValues("imageUris") ?? []) as ImageUri[];
    const merged = dedupeImageUris([
      ...current,
      ...imageUris.map((uri) => ({ uri })),
    ]);

    if (merged.length > 5) {
      Alert.alert("최대 5개의 이미지를 추가할 수 있습니다.");
      return;
    }
    setValue("imageUris", merged, { shouldDirty: true, shouldTouch: true });
  };

  const handleOpenImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
    });

    if (result.canceled) {
      return;
    }

    const formData = getFormDataImages("images", result.assets);
    uploadImages(formData, {
      onSuccess: (imageUris) => {
        addImageUris(imageUris);
      },
      onError: (error) => {
        Alert.alert(`이미지 업로드에 실패했습니다. ${error.message}`);
      },
    });
  };

  return (
    <View
      style={[
        styles.container,
        includeSafeAreaBottomPadding ? { paddingBottom: inset.bottom } : undefined,
      ]}
    >
      <Pressable
        style={styles.footerIcon}
        onPress={handleOpenImagePicker}
        disabled={isUploading}
      >
        <Ionicons name={"camera"} size={20} color={colors.BLACK} />
        <Text>갤러리</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 0,
    paddingBottom: 10,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 10,
  },
  footerIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: colors.GRAY_100,
    padding: 10,
    borderRadius: 5,
  },
});

export default PostWriteFooter;
