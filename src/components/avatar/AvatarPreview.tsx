import { fetchAvatarPreviewDataUri } from "@/api/avatar";
import { colors } from "@/constants";
import type { AvatarPreviewProps } from "@/types";
import { isCancel } from "axios";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PREVIEW_SIZE } from "./AvatarImageLayer";

export default function AvatarPreview({ avatarItem }: AvatarPreviewProps) {
  const [dataUri, setDataUri] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const fetchPreview = async () => {
      try {
        const uri = await fetchAvatarPreviewDataUri(avatarItem, signal);
        if (signal.aborted) return;
        setDataUri(uri);
      } catch (e) {
        if (signal.aborted || isCancel(e)) return;
      }
    };

    fetchPreview();

    return () => {
      abortController.abort();
    };
  }, [avatarItem]);

  return (
    <View
      collapsable={false}
      style={[styles.box, { width: PREVIEW_SIZE, height: PREVIEW_SIZE }]}
    >
      {dataUri ? (
        <Image
          source={{ uri: dataUri }}
          style={styles.image}
          contentFit="contain"
          transition={0}
          cachePolicy="none"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  errorText: {
    fontSize: 12,
    color: colors.GRAY_600,
    textAlign: "center",
    paddingHorizontal: 12,
  },
});
