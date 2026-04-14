import { API_BASE_URL } from "@/api/config/axiosInstance";
import { colors } from "@/constants";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface ProfileProps {
  onPress: () => void;
  nickname: string;
  imageUri?: string;
  createdAt: string;
  option?: ReactNode;
}

dayjs.locale("ko");
dayjs.extend(relativeTime);

function formatCreatedAtRelative(createdAt: string): string {
  const parsed = dayjs(createdAt);
  const now = dayjs();
  const aheadMs = parsed.valueOf() - now.valueOf();
  const maxSkewMs = 5 * 60 * 1000;
  if (aheadMs > 0 && aheadMs < maxSkewMs) {
    return now.fromNow();
  }
  return parsed.fromNow();
}

/** 게시글 썸네일·마이페이지와 같이 상대 경로면 API 호스트를 붙임 */
function resolveProfileUri(uri?: string): string | undefined {
  const t = uri?.trim();
  if (!t) return undefined;
  if (t.startsWith("http")) return t;
  return `${API_BASE_URL}/${t.startsWith("/") ? t.slice(1) : t}`;
}

function ProfileImage({
  onPress,
  imageUri,
  nickname,
  createdAt,
  option,
}: ProfileProps) {
  const resolved = resolveProfileUri(imageUri);

  return (
    <View style={styles.container}>
      <Pressable style={styles.profileContainer} onPress={onPress}>
        <Image
          source={
            resolved
              ? { uri: resolved }
              : require("@/assets/images/default-avatar.png")
          }
          style={styles.avatar}
        />
        <View style={{ gap: 4 }}>
          <Text style={styles.nickname}>{nickname}</Text>
          <Text style={styles.createdAt}>{formatCreatedAtRelative(createdAt)}</Text>
        </View>
      </Pressable>
      {option}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.GRAY_300,
  },
  nickname: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.BLACK,
  },
  createdAt: {
    fontSize: 14,
    color: colors.GRAY_500,
  },
});

export default ProfileImage;
