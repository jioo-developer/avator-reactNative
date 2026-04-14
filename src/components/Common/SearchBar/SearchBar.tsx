import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";

export type SearchBarProps = {
  onSubmit?: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  onSubmit,
  placeholder = "글 제목 검색",
}: SearchBarProps) {
  const defaultAvatarSource = require("@/assets/images/logo.png");
  const [value, setValue] = useState("");

  const handleChangeText = (text: string) => {
    setValue(text);
    if (text === "") onSubmit?.("");
  };

  const handleClear = () => {
    setValue("");
    onSubmit?.("");
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    onSubmit?.(value.trim());
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Image
          source={defaultAvatarSource}
          style={styles.avatar}
        />

        <TextInput
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.GRAY_500}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {value.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="검색어 지우기"
            onPress={handleClear}
            hitSlop={10}
            style={styles.iconButton}
          >
            <Ionicons name="close-circle" size={18} color={colors.GRAY_500} />
          </Pressable>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="검색"
          onPress={handleSubmit}
          hitSlop={10}
          style={styles.iconButton}
        >
          <Ionicons name="search" size={20} color={colors.GRAY_600} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: colors.WHITE,
  },
  bar: {
    height: 44,
    borderRadius: 18,
    backgroundColor: colors.GRAY_100,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 12,
    gap: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.GRAY_300,
    backgroundColor: colors.GRAY_200,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.BLACK,
    paddingVertical: 0,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

