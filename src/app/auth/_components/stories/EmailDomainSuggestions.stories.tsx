import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import EmailDomainSuggestions from "../EmailDomainSuggestions";

const meta = {
  title: "Components/InputField/Modules/EmailDomainSuggestions",
  component: EmailDomainSuggestions,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: 360 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    onSelect: () => { },
    value: "user@g",
  },
} satisfies Meta<typeof EmailDomainSuggestions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SuggestionsVisible: Story = {
  args: { value: "user@g" },
};

export const FilteredByDomain: Story = {
  args: { value: "hello@gm" },
};

export const HiddenWhenDomainComplete: Story = {
  args: { value: "user@gmail.com" },
};

export const HiddenWithoutAt: Story = {
  args: { value: "useronly" },
};
