import { colors } from "@/constants";
import { Switch, SwitchProps } from "react-native";

export type CommonToggleProps = SwitchProps;

export default function CommonToggle({
  trackColor,
  thumbColor = colors.WHITE,
  ios_backgroundColor = colors.GRAY_300,
  ...rest
}: CommonToggleProps) {
  return (
    <Switch
      trackColor={{
        false: colors.GRAY_300,
        true: colors.PRIMARY,
        ...trackColor,
      }}
      thumbColor={thumbColor}
      ios_backgroundColor={ios_backgroundColor}
      accessibilityRole="switch"
      accessibilityState={{ checked: rest.value }}
      {...rest}
    />
  );
}
