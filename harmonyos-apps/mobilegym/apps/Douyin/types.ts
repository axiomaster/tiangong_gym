export interface DouyinComment {
  id: string;
  user: string;
  content: string;
  timeText: string;
  likes: number;
  liked: boolean;
}

export interface DouyinVideoItem {
  id: string;
  authorId: string;
  authorHandle: string;
  authorName: string;
  captionShort: string;
  captionFull: string;
  likesCountText: string;
  commentsCount: number;
  starsCount: number;
  sharesCountText: string;
  liked: boolean;
  starred: boolean;
  followedAuthor: boolean;
  comments: DouyinComment[];
}

export interface DouyinFriendItem {
  id: string;
  name: string;
  bio: string;
  statusText: string;
  mutual: boolean;
}

export interface DouyinMessageItem {
  id: string;
  sender: string;
  preview: string;
  timeText: string;
  unread: number;
}

export interface DouyinUserProfile {
  name: string;
  douyinId: string;
  bio: string;
  likesReceived: string;
  followingCount: number;
  followersCount: string;
}
