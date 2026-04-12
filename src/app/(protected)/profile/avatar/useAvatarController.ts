import useAuth from "@/hooks/queries/auth/useAuth";
import useGetAvatarItems from "@/hooks/queries/myPage/useGetAvatarItems";
import type { AvatarItemState, AvatarListRow } from "@/types";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import Toast from "react-native-toast-message";

/** Filename without extension; matches API paths to saved avatar ids. */
export function getImageId(relativePath: string): string {
  const segment = relativePath.split("/").pop() ?? relativePath;
  const dot = segment.lastIndexOf(".");
  return dot === -1 ? segment : segment.slice(0, dot);
}

export function useAvatarController() {
  const pagerRef = useRef<PagerView | null>(null);
  const [currentTab, setCurrentTab] = useState(0);

  const { hats, faces, tops, bottoms, hands, skins } = useGetAvatarItems();
  const { auth, profileMutation } = useAuth();

  const [avatarItem, setAvatarItem] = useState<AvatarItemState>({
    hatId: auth?.hatId ?? "",
    faceId: auth?.faceId ?? "",
    topId: auth?.topId ?? "",
    bottomId: auth?.bottomId ?? "",
    handId: auth?.handId ?? "",
    skinId: auth?.skinId || "01",
  });

  const lists: AvatarListRow[] = useMemo(
    () => [
      { data: hats, name: "hatId", id: avatarItem.hatId },
      { data: faces, name: "faceId", id: avatarItem.faceId },
      { data: tops, name: "topId", id: avatarItem.topId },
      { data: bottoms, name: "bottomId", id: avatarItem.bottomId },
      { data: hands, name: "handId", id: avatarItem.handId },
      { data: skins, name: "skinId", id: avatarItem.skinId },
    ],
    [hats, faces, tops, bottoms, hands, skins, avatarItem],
  );

  const handlePressItem = (name: keyof AvatarItemState, item: string) => {
    setAvatarItem((prev) => ({
      ...prev,
      [name]: getImageId(item),
    }));
  };

  const handlePressTab = (index: number) => {
    pagerRef.current?.setPage(index);
    setCurrentTab(index);
  };

  const handleSaveAvatar = () => {
    profileMutation.mutate(avatarItem, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "아바타가 저장되었습니다.",
        });
        router.back();
      },
    });
  };

  return {
    pagerRef,
    currentTab,
    setCurrentTab,
    avatarItem,
    handlePressItem,
    handlePressTab,
    handleSaveAvatar,
    getImageId,
    lists,
    hats,
    faces,
    tops,
    bottoms,
    hands,
    skins,
  };
}
