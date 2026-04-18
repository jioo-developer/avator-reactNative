interface User {
  id: number;
  nickname: string;
  imageUri?: string;
}

interface Profile extends User {
  email: string;
  introduce?: string;
  hatId: string;
  handId: string;
  skinId: string;
  topId: string;
  faceId: string;
  bottomId: string;
  background: string;
}

interface ImageUri {
  id?: number;
  uri: string;
}
interface VoteOption {
  id?: number;
  displayPriority: number;
  content: string;
}

interface CreatePostDto {
  title: string;
  description: string;
  imageUris: ImageUri[];
  voteTitle?: string;
  voteOptions?: VoteOption[];
}

interface CreateCommentDto {
  content: string;
  postId: number;
  parentCommentId?: number;
}

interface CreateVoteDto {
  postId: number;
  voteOptionId: number;
}

type PostVoteOption = VoteOption & { userVotes: { userId: number }[] };

interface PostVote {
  id: number;
  title: string;
  options: PostVoteOption[];
}
interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: User;
  isDeleted: boolean;
  likes?: { userId: number | null }[];
}

interface PostComment extends Comment {
  replies: Comment[];
}

interface Post {
  id: number;
  userId: number;
  title: string;
  description: string;
  createdAt: string;
  author: User;
  imageUris: ImageUri[];
  likes: { userId: number }[];
  hasVote: boolean;
  voteCount: number;
  commentCount: number;
  viewCount: number;
  votes?: PostVote[];
  comments?: PostComment[];
}

type RequestUpdatePost = {
  id: number;
  body: CreatePostDto;
}

// 아바타 관련 타입

type AvatarItemState = {
  hatId: string;
  faceId: string;
  topId: string;
  bottomId: string;
  handId: string;
  skinId: string;
};

type AvatarListRow = {
  data: string[];
  name: keyof AvatarItemState;
  id: string;
};


type AvatarPreviewProps = {
  avatarItem: AvatarItemState;
};

type LayerDef = {
  key: string;
  zIndex: number;
  path: string | null;
};

type RequestUser = {
  email: string;
  password: string;
};

type RequestLogin = RequestUser & {
  expoPushToken?: string;
};


export type {
  AvatarItemState, AvatarListRow, AvatarPreviewProps, Comment, CreateCommentDto, CreatePostDto, CreateVoteDto, ImageUri, LayerDef, Post, PostVote,
  PostVoteOption, Profile, RequestLogin, RequestUpdatePost, RequestUser, User, VoteOption
};

