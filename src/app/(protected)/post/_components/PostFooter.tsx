import { colors } from "@/constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePostFooter } from "./handler/usePostFooter";

type PostWriteFooterProps = {
  includeSafeAreaBottomPadding?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
};

function PostFooter({
  includeSafeAreaBottomPadding = false,
  onUploadingChange,
}: PostWriteFooterProps) {
  const inset = useSafeAreaInsets();
  const { setValue, getValues } = useFormContext();
  const { handleOpenImagePicker, isUploading } = usePostFooter();

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

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
      <Pressable onPress={() => setValue("isVoteOpen", !getValues("isVoteOpen"))}>
        <MaterialCommunityIcons name="vote" size={20} color={colors.BLACK} />
        <Text>투표</Text>
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

export default PostFooter;
