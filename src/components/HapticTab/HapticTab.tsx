import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import * as React from "react";

export const HapticTab = React.forwardRef<
  React.ComponentRef<typeof PlatformPressable>,
  BottomTabBarButtonProps
>(function HapticTab(props, ref) {
  return (
    <PlatformPressable
      ref={ref}
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
});
