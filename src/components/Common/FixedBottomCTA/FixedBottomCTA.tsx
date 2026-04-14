import CommonButton from "../CommonButton/CommonButton";
import { colors } from "@/constants";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FixedBottomCTAProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

function FixedBottomCTA({ label, onPress, disabled = false }: FixedBottomCTAProps) {
  const inset = useSafeAreaInsets();

  const bottomPad = Math.max(inset.bottom, 12);

  return (
    <View
      style={[
        styles.fixed,
        { paddingBottom: bottomPad },
        Platform.OS === "android" ? styles.fixedAndroid : null,
      ]}
    >
      <CommonButton label={label} onPress={onPress} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  fixed: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.WHITE,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.GRAY_300,
    paddingTop: 12,
    paddingHorizontal: 16,
    zIndex: 100,
  },
  fixedAndroid: {
    elevation: 12,
  },
});

export default FixedBottomCTA;
