import CommonButton from "../CommonButton/CommonButton";
import { colors } from "@/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FixedBottomCTAProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

function FixedBottomCTA({ label, onPress, disabled = false }: FixedBottomCTAProps) {
  const inset = useSafeAreaInsets();

  return (
    <View style={[styles.fixed, { paddingBottom: inset.bottom || 12 }]}>
      <CommonButton label={label} onPress={onPress} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  fixed: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.GRAY_300,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
});

export default FixedBottomCTA;
