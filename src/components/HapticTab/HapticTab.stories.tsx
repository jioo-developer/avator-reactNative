import { NavigationContainer } from "@react-navigation/native";
import type { Meta, StoryObj } from "@storybook/react";
import { Text, View } from "react-native";
import { fn } from "storybook/test";
import { HapticTab } from "./HapticTab";

function TabChildren() {
  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#F6F6F6",
        borderRadius: 8,
      }}
    >
      <Text>탭 버튼</Text>
    </View>
  );
}

const meta = {
  title: "Components/HapticTab",
  component: HapticTab,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NavigationContainer>
        <View style={{ padding: 24 }}>
          <Story />
        </View>
      </NavigationContainer>
    ),
  ],
} satisfies Meta<typeof HapticTab>;

export default meta;

type Story = StoryObj<typeof meta>;

/** PlatformPressable이 useTheme()를 쓰므로 NavigationContainer가 필요합니다. */
export const Default: Story = {
  args: {
    accessibilityRole: "button",
    onPress: fn(),
    children: <TabChildren />,
  },
  render: (args) => <HapticTab {...args} />,
};
