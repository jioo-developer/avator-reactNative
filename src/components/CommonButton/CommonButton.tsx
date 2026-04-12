import { colors } from "@/constants";
import React from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface CommonButtonProps extends PressableProps {
  label: string;
  size?: "medium" | "large";
  variant?: "standard" | "filled";
}

function CommonButton({
  label,
  size = "large",
  variant = "filled",
  disabled,
  ...props
}: CommonButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        size === "large" && styles.large,
        variant === "filled" ? styles.filledPressable : styles.standardPressable,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      {...props}
    >
      <Text
        style={variant === "filled" ? styles.filledText : styles.standardText}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  large: {
    width: "100%",
    height: 48,
  },
  filledPressable: {
    backgroundColor: colors.ORANGE_600,
  },
  standardPressable: {
    backgroundColor: "transparent",
  },
  filledText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.WHITE,
  },
  standardText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.ORANGE_600,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.45,
  },
});

export default CommonButton;
