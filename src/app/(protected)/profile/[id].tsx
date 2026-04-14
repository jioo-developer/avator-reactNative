import { API_BASE_URL } from "@/api/config/axiosInstance";
import { AuthRoute } from "@/components";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import useGetUserProfile from "@/hooks/queries/myPage/useGetUserProfile";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Tab from "../../../components/page/my/Tab";
import UserFeedList from "../../../components/page/my/UserFeedList";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { id: userId } = useLocalSearchParams();
  const { auth } = useAuth();
  const { data: profile } = useGetUserProfile(Number(userId));
  const { nickname, introduce, imageUri } = profile || {};

  const isOwnProfile = Number(userId) === Number(auth.id);

  useEffect(() => {
    if (isOwnProfile) return;
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.ORANGE_200,
      },
    });
  }, [navigation, isOwnProfile]);

  if (isOwnProfile) {
    return <Redirect href="/my" />;
  }

  return (
    <AuthRoute>
      <View style={styles.header}>
        <Image
          source={
            imageUri
              ? {
                uri: `${API_BASE_URL}/${imageUri}`,
              }
              : require("@/assets/images/default-avatar.png")
          }
          style={styles.avatar}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Text style={styles.nickname}>{nickname}</Text>
          <Text style={styles.introduce}>{introduce}</Text>
        </View>
      </View>
      <View style={styles.tabContainer}>
        <Tab isActive>게시물</Tab>
      </View>
      <UserFeedList userId={Number(userId)} />
    </AuthRoute>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "relative",
    backgroundColor: colors.ORANGE_200,
    width: "100%",
    height: 77,
  },
  avatar: {
    position: "absolute",
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
