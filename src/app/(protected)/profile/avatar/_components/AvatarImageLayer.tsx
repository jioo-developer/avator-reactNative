import { API_BASE_URL } from "@/api/config/axiosInstance";
import { Image } from "expo-image";

export const PREVIEW_SIZE = 229;

type AvatarImageLayerProps = {
  path: string | null;
  zIndex: number;
};

export function AvatarImageLayer({ path, zIndex }: AvatarImageLayerProps) {
  if (!path) return null;

  const uri = `${API_BASE_URL}/${path}`;

  return (
    <Image
      key={uri}
      source={{ uri }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        zIndex,
      }}
      contentFit="contain"
      transition={0}
      cachePolicy="none"
      collapsable={false}
    />
  );
}
