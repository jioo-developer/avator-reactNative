import { API_BASE_URL } from "@/api/config/axiosInstance";
import { AuthRoute, CommonButton as CustomButton } from "@/components";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { Href, router } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import PagerView from "react-native-pager-view";
import LikedFeedList from "../../../../components/page/my/LikedFeedList";
import MyFeedList from "../../../../components/page/my/MyFeedList";
import Tab from "../../../../components/page/my/Tab";

export default function MyScreen() {
  const { auth } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const pagerRef = useRef<PagerView | null>(null);

  const handlePressTab = (index: number) => {
    pagerRef.current?.setPage(index);
    setCurrentTab(index);
  };

  return (
    <AuthRoute>
      <View style={styles.header}>
        <Image
          source={
            auth.imageUri
              ? {
                uri: `${API_BASE_URL}/${auth.imageUri}`,
              }
              : require("@/assets/images/default-avatar.png")
          }
          style={styles.avatar}
        />
        <CustomButton
          size="medium"
          variant="outlined"
          label="프로필 편집"
          style={{ position: "absolute", right: 16, bottom: 16 }}
          onPress={() => router.push("/profile/update" as Href)}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Text style={styles.nickname}>{auth.nickname}</Text>
          <Text style={styles.introduce}>{auth.introduce}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <Tab isActive={currentTab === 0} onPress={() => handlePressTab(0)}>
          게시물
        </Tab>
        <Tab isActive={currentTab === 1} onPress={() => handlePressTab(1)}>
          좋아한 게시물
        </Tab>
      </View>

      <PagerView
        ref={pagerRef}
        initialPage={0}
        style={{ flex: 1 }}
        onPageSelected={(e) => setCurrentTab(e.nativeEvent.position)}
      >
        <MyFeedList key="1" />
        <LikedFeedList key="2" />
      </PagerView>
    </AuthRoute>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "relative",
    backgroundColor: colors.ORANGE_200,
    width: "100%",
    height: 154,
  },
  avatar: {
    position: "absolute",
    top: 77,
    left: 16,
    width: 154,
    height: 154,
    borderRadius: 154,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.GRAY_500,
  },
  container: {
    marginTop: 77,
  },
  profile: {
    padding: 16,
    gap: 16,
  },
  nickname: {
    fontSize: 24,
    fontWeight: "bold",
  },
  introduce: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
  },
});
