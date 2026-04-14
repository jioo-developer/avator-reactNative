import { colors } from "@/constants";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"; // RN UI 컴포넌트 import
import handleSuggestion from "./handler/handleSuggestion";

// 컴포넌트 Props 타입 정의
type Props = {
  value: string;
  onSelect: (email: string) => void;
};

// 이메일 도메인 추천 컴포넌트
function EmailDomainSuggestions({
  value,
  onSelect,
}: Props) {
  const { suggestions } = handleSuggestion(value);

  // 추천이 없으면 렌더링 안함
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
        nestedScrollEnabled
      >
        {suggestions.map((email) => (
          <Pressable
            key={email}
            onPress={() => onSelect(email)}
            // 클릭 시 이메일 선택
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Text style={styles.rowText}>{email}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    backgroundColor: colors.WHITE,
    overflow: "hidden",
    maxHeight: 220,
  },
  scroll: {
    maxHeight: 180,
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.GRAY_200,
  },
  rowPressed: {
    backgroundColor: colors.GRAY_100,
  },
  rowText: {
    fontSize: 15,
    color: colors.BLACK,
  },
});

export default EmailDomainSuggestions;