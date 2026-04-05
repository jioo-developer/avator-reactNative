import { colors } from "@/constants";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"; // RN UI 컴포넌트 import

// 컴포넌트 Props 타입 정의
type Props = {
  value: string;
  onSelect: (email: string) => void;
};

// 기본 이메일 도메인 리스트
const DEFAULT_DOMAINS = [
  "gmail.com",
  "naver.com",
  "daum.net",
  "hanmail.net",
  "kakao.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
] as const;

// 이메일 도메인 추천 컴포넌트
function EmailDomainSuggestions({
  value,
  onSelect,
}: Props) {
  // value를 '@' 기준으로 분리 (localPart: 앞, domainPart: 뒤)
  const [localPart = "", domainPart = ""] = value.split("@");

  const domainQuery = domainPart.trim().toLowerCase(); // 도메인 입력값 정규화

  const hasAtSymbol = value.includes("@"); // '@' 포함 여부
  const hasLocalPart = localPart.length > 0; // 로컬 파트 존재 여부
  const hasOnlyOneDomainInput = !domainPart.includes("@"); // '@'가 하나만 있는지 체크

  // 사용자가 입력한 도메인이 목록에 있는 도메인과 "완전히 일치"하는지 확인
  // → 이미 완성된 상태라면 자동완성 추천을 보여줄 필요 X
  const isCompleteDomain =
    domainQuery.length > 0 &&
    DEFAULT_DOMAINS.some((domain) => domain.toLowerCase() === domainQuery);

  // 추천을 보여줄 수 있는 조건
  const canShowSuggestions =
    hasAtSymbol && // '@'가 있고
    hasLocalPart && // 앞부분도 있고
    hasOnlyOneDomainInput && // '@'가 하나만 있고
    !isCompleteDomain; // 이미 완성된 도메인이 아니어야 함

  // 추천 가능한 상태라면,
  // 입력 중인 도메인을 기준으로 prefix 매칭하여 자동완성 후보 생성
  const matchedDomains = canShowSuggestions
    ? DEFAULT_DOMAINS.filter((domain) => domain.startsWith(domainQuery))
    : [];

  // 최대 8개까지 추천 이메일 생성
  const suggestions = matchedDomains
    .slice(0, 8)
    .map((domain) => `${localPart}@${domain}`);

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