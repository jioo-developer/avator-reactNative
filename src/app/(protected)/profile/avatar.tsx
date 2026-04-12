import { API_BASE_URL } from "@/api/config/axiosInstance";
import { FixedBottomCTA } from "@/components";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import useGetAvatarItems from "@/hooks/queries/myPage/useGetAvatarItems";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SvgUri } from "react-native-svg";
import Toast from "react-native-toast-message";
import Tab from "../(tabs)/my/_components/Tab";
import AvatarItem from "./_components/AvatarItem";
export default function AvatarScreen() {
  const navigation = useNavigation();
  const pagerRef = useRef<PagerView | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const { hats, faces, tops, bottoms, hands, skins } = useGetAvatarItems();
  const { auth, profileMutation } = useAuth();

  const [avatarItem, setAvatarItem] = useState({
    hatId: auth?.hatId ?? "",
    faceId: auth?.faceId ?? "",
    topId: auth?.topId ?? "",
    bottomId: auth?.bottomId ?? "",
    handId: auth?.handId ?? "",
    skinId: auth?.skinId ?? "01",
  });

  const getImageId = (url: string) => {
    const filename = url.split("/").pop() ?? "";
    const [id] = filename.split(".");

    return id;
  };

  const handlePressItem = (name: string, item: string) => {
    setAvatarItem((prev) => ({ ...prev, [name]: getImageId(item) }));
  };

  const handlePressTab = (index: number) => {
    pagerRef.current?.setPage(index);
    setCurrentTab(index);
  };

  const handleSaveAvatar = () => {
    profileMutation.mutate(avatarItem, {
      onSuccess: () =>
        Toast.show({
          type: "success",
          text1: "저장되었습니다.",
        }),
    });
  };

  const getAvatarItemUrl = (category: string, id?: string) => {
    const baseUrl = `${API_BASE_URL}/items/${category}/${id}.svg`;

    if (category === "default" || !Boolean(id)) {
      return `${baseUrl}/default/frame.svg`;
    }

    return `${baseUrl}/items/${category}/${id}.svg`;
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.ORANGE_200,
      },
    });
  }, [navigation]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            {avatarItem.hatId && (
              <SvgUri
                uri={getAvatarItemUrl("hats", avatarItem.hatId)}
                style={[styles.avatar, { zIndex: 70 }]}
              />
            )}
            {avatarItem.faceId && (
              <SvgUri
                uri={getAvatarItemUrl("faces", avatarItem.faceId)}
                style={[styles.avatar, { zIndex: 60 }]}
              />
            )}
            {avatarItem.topId && (
              <SvgUri
                uri={getAvatarItemUrl("tops", avatarItem.topId)}
                style={[styles.avatar, { zIndex: 50 }]}
              />
            )}
            {avatarItem.bottomId && (
              <SvgUri
                uri={getAvatarItemUrl("bottoms", avatarItem.bottomId)}
                style={[styles.avatar, { zIndex: 40 }]}
              />
            )}
            <SvgUri
              uri={getAvatarItemUrl("default")}
              style={[styles.avatar, { zIndex: 30 }]}
            />
            {avatarItem.skinId && (
              <SvgUri
                uri={getAvatarItemUrl("skins", avatarItem.skinId)}
                style={[styles.avatar, { zIndex: 20 }]}
              />
            )}
            {avatarItem.handId && (
              <SvgUri
                uri={getAvatarItemUrl("hands", avatarItem.handId)}
                style={[styles.avatar, { zIndex: 10 }]}
              />
            )}
          </View>
        </View>
        <View style={styles.tabContainer}>
          {["모자", "얼굴", "상의", "하의", "손", "피부"].map((tab, index) => (
            <Tab
              key={index}
              isActive={currentTab === index}
              onPress={() => handlePressTab(index)}
            >
              {tab}
            </Tab>
          ))}
        </View>
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => setCurrentTab(e.nativeEvent.position)}
        >
          {[
            { data: hats, name: "hatId", id: avatarItem.hatId },
            { data: faces, name: "faceId", id: avatarItem.faceId },
            { data: tops, name: "topId", id: avatarItem.topId },
            { data: bottoms, name: "bottomId", id: avatarItem.bottomId },
            { data: hands, name: "handId", id: avatarItem.handId },
            { data: skins, name: "skinId", id: avatarItem.skinId },
          ].map((list) => (
            <FlatList
              key={list.name}
              data={list.data}
              keyExtractor={(item, index) => String(index)}
              numColumns={3}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <AvatarItem
                  uri={item}
                  isSelected={getImageId(item) === list.id}
                  onPress={() => handlePressItem(list.name, item)}
                />
              )}
            />
          ))}
        </PagerView>
      </View>

      <FixedBottomCTA label="저장" onPress={handleSaveAvatar} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    position: "relative",
    backgroundColor: colors.ORANGE_200,
    width: "100%",
    height: 115,
    marginBottom: 115,
  },
  avatarContainer: {
    width: 229,
    height: 229,
    borderRadius: 229,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    backgroundColor: colors.WHITE,
  },
  avatar: {
    width: 229,
    height: 229,
    position: "absolute",
  },
  listContainer: {
    paddingBottom: 120,
    marginTop: 10,
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
  },
  pagerView: {
    flex: 1,
  },
});
