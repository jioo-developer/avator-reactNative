import { API_BASE_URL } from "@/api/config/axiosInstance";
import { Image } from "expo-image";
import { Platform, View } from "react-native";

export const PREVIEW_SIZE = 229;

type AvatarImageLayerProps = {
  path: string | null;
  zIndex: number;
};

export function AvatarImageLayer({ path, zIndex }: AvatarImageLayerProps) {
  const uri = path ? `${API_BASE_URL}/${path}` : null;
  const androidElevation = Platform.OS === "android" ? zIndex / 10 : undefined;

  return (
    <View
      collapsable={false}
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        zIndex,
        elevation: androidElevation,
      }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="contain"
          transition={0}
          cachePolicy="none"
        />
      ) : null}
    </View>
  );
}
