import type { Meta, StoryObj } from "@storybook/react";
import type { Post } from "@/types";
import { View } from "react-native";
import FeedItem from "./FeedItem";

const mockPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: "첫 번째 게시글",
    description: "스토리북용 더미 본문입니다.",
    createdAt: new Date().toISOString(),
    author: { id: 1, nickname: "user1" },
    imageUris: [],
    likes: [],
    hasVote: false,
    voteCount: 0,
    commentCount: 2,
    viewCount: 10,
  },
  {
    id: 2,
    userId: 2,
    title: "두 번째 게시글",
    description: "다른 더미 게시글입니다.",
    createdAt: new Date().toISOString(),
    author: { id: 2, nickname: "user2" },
    imageUris: [],
    likes: [{ userId: 1 }],
    hasVote: false,
    voteCount: 0,
    commentCount: 0,
    viewCount: 5,
  },
];

const meta = {
  title: "Components/FeedItem",
  component: FeedItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View style={{ padding: 16, width: 400 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof FeedItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { post: mockPosts[0] },
};

export const Second: Story = {
  args: { post: mockPosts[1] },
};
