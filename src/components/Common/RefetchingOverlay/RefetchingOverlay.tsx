import { colors } from "@/constants";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function RefetchingOverlay() {
  return (
    <View style={styles.overlay}>
      <View style={styles.inner}>
        <ActivityIndicator size="large" color={colors.ORANGE_600} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RefetchingOverlay;
