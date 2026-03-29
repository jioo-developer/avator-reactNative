import { colors } from "@/constants";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  value: string;
  onSelect: (email: string) => void;
  domains?: readonly string[];
};

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

function EmailDomainSuggestions({
  value,
  onSelect,
  domains = DEFAULT_DOMAINS,
}: Props) {
  const [local = "", rawDomain = ""] = value.split("@");
  const domainQuery = rawDomain.trim().toLowerCase();

  const hasAtSymbol = value.includes("@");
  const hasLocalPart = local.length > 0;
  const hasOnlyOneDomainInput = !rawDomain.includes("@");

  const isCompleteDomain =
    domainQuery.length > 0 &&
    domains.some((domain) => domain.toLowerCase() === domainQuery);

  const canShowSuggestions =
    hasAtSymbol &&
    hasLocalPart &&
    hasOnlyOneDomainInput &&
    !isCompleteDomain;

  const matchedDomains = canShowSuggestions
    ? domains.filter((domain) => domain.startsWith(domainQuery))
    : [];

  const suggestions = matchedDomains
    .slice(0, 8)
    .map((domain) => `${local}@${domain}`);

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