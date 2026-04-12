import type { AvatarPreviewProps, LayerDef } from "@/types";
import { Platform, View } from "react-native";
import { getImageId } from "../useAvatarController";
import { AvatarImageLayer, PREVIEW_SIZE } from "./AvatarImageLayer";

function pathForId(list: string[], id: string): string | null {
  if (!id) return null;
  return list.find((item) => getImageId(item) === id) ?? null;
}

export default function AvatarPreview({
  avatarItem,
  hats,
  faces,
  tops,
  bottoms,
  hands,
  skins,
}: AvatarPreviewProps) {
  const layers: LayerDef[] = [
    { key: "skin", zIndex: 10, path: pathForId(skins, avatarItem.skinId) },
    { key: "face", zIndex: 20, path: pathForId(faces, avatarItem.faceId) },
    { key: "bottom", zIndex: 30, path: pathForId(bottoms, avatarItem.bottomId) },
    { key: "top", zIndex: 40, path: pathForId(tops, avatarItem.topId) },
    { key: "hand", zIndex: 50, path: pathForId(hands, avatarItem.handId) },
    { key: "hat", zIndex: 60, path: pathForId(hats, avatarItem.hatId) },
  ];

  return (
    <View
      collapsable={false}
      needsOffscreenAlphaCompositing={Platform.OS === "ios"}
      style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE, position: "relative" }}
    >
      {layers.map(({ key, zIndex, path }) => (
        <AvatarImageLayer key={key} zIndex={zIndex} path={path} />
      ))}
    </View>
  );
}
