import { API_BASE_URL } from "@/api/config/axiosInstance";
import type { AvatarPreviewProps, LayerDef } from "@/types";
import { Image } from "expo-image";
import { Platform, View } from "react-native";
import { getImageId } from "../useAvatarController";

const PREVIEW_SIZE = 229;

function pathForId(list: string[], id: string): string | null {
  if (!id) return null;
  return list.find((item) => getImageId(item) === id) ?? null;
}

function AvatarImageLayer({
  slotKey,
  path,
  zIndex,
}: {
  slotKey: string;
  path: string | null;
  zIndex: number;
}) {
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
          // 저장 payload는 맞는데 미리보기만 틀리는 경우: 디스크/메모리 캐시·뷰 풀링이 낡은 비트맵을 보여주는 경우가 있음
          cachePolicy="none"
        />
      ) : null}
    </View>
  );
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
  // 뒤 → 앞: 피부 → 얼굴 → 하의 → 상의 → 손 → 모자
  // (얼굴을 상·하의보다 앞에 두면 흰 몸통 PNG가 옷을 덮는 경우가 많음 → 얼굴을 의상 아래로)
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
        <AvatarImageLayer key={key} slotKey={key} zIndex={zIndex} path={path} />
      ))}
    </View>
  );
}
