import { createAppStoreWithActions } from '../../os/createAppStore';
import {
  DOUYIN_CONFIG,
  type DouyinVideoItem,
  type DouyinFriendItem,
  type DouyinMessageItem,
  type DouyinUserProfile,
} from './data';

interface DouyinState {
  user: DouyinUserProfile;
  mainVideo: DouyinVideoItem;
  friends: DouyinFriendItem[];
  messages: DouyinMessageItem[];
  hotSearches: string[];
  publishedCaptions: string[];
  captionExpanded: boolean;
  fullscreenMode: boolean;
}

interface DouyinActions {
  toggleVideoLike: () => void;
  toggleVideoStar: () => void;
  toggleFollowAuthor: () => void;
  toggleCaptionExpanded: () => void;
  toggleFullscreenMode: () => void;
  addComment: (text: string) => void;
  toggleCommentLike: (commentId: string) => void;
  toggleFriendFollow: (friendId: string) => void;
  markAllMessagesRead: () => void;
  markMessageRead: (id: string) => void;
  publishWork: (caption: string) => void;
}

const initialState: DouyinState = {
  user: DOUYIN_CONFIG.user,
  mainVideo: {
    ...DOUYIN_CONFIG.mainVideo,
    comments: [...DOUYIN_CONFIG.mainVideo.comments],
  },
  friends: [...DOUYIN_CONFIG.friends],
  messages: [...DOUYIN_CONFIG.messages],
  hotSearches: [...DOUYIN_CONFIG.hotSearches],
  publishedCaptions: ['男装人的国庆八天乐 #服装人日常'],
  captionExpanded: false,
  fullscreenMode: false,
};

export const useDouyinStore = createAppStoreWithActions<DouyinState, DouyinActions>(
  'douyin',
  initialState,
  (set) => ({
    toggleVideoLike: () =>
      set((state) => {
        const nextLiked = !state.mainVideo.liked;
        return {
          mainVideo: {
            ...state.mainVideo,
            liked: nextLiked,
            likesCountText: nextLiked ? '15.8万' : '15.7万',
          },
        };
      }),

    toggleVideoStar: () =>
      set((state) => {
        const nextStarred = !state.mainVideo.starred;
        return {
          mainVideo: {
            ...state.mainVideo,
            starred: nextStarred,
            starsCount: nextStarred
              ? state.mainVideo.starsCount + 1
              : state.mainVideo.starsCount - 1,
          },
        };
      }),

    toggleFollowAuthor: () =>
      set((state) => ({
        mainVideo: {
          ...state.mainVideo,
          followedAuthor: !state.mainVideo.followedAuthor,
        },
      })),

    toggleCaptionExpanded: () =>
      set((state) => ({
        captionExpanded: !state.captionExpanded,
      })),

    toggleFullscreenMode: () =>
      set((state) => ({
        fullscreenMode: !state.fullscreenMode,
      })),

    addComment: (text) =>
      set((state) => {
        const trimmed = text.trim();
        if (!trimmed) return state;
        const newComment = {
          id: `cmt_${state.mainVideo.comments.length + 1}`,
          user: state.user.name,
          content: trimmed,
          timeText: '刚刚',
          likes: 1,
          liked: false,
        };
        return {
          mainVideo: {
            ...state.mainVideo,
            commentsCount: state.mainVideo.commentsCount + 1,
            comments: [newComment, ...state.mainVideo.comments],
          },
        };
      }),

    toggleCommentLike: (commentId) =>
      set((state) => ({
        mainVideo: {
          ...state.mainVideo,
          comments: state.mainVideo.comments.map((c) =>
            c.id === commentId
              ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
              : c,
          ),
        },
      })),

    toggleFriendFollow: (friendId) =>
      set((state) => ({
        friends: state.friends.map((f) =>
          f.id === friendId ? { ...f, mutual: !f.mutual } : f,
        ),
      })),

    markAllMessagesRead: () =>
      set((state) => ({
        messages: state.messages.map((m) => ({ ...m, unread: 0 })),
      })),

    markMessageRead: (id) =>
      set((state) => ({
        messages: state.messages.map((m) => (m.id === id ? { ...m, unread: 0 } : m)),
      })),

    publishWork: (caption) =>
      set((state) => {
        const text = caption.trim() || '分享今日抖音日常 #生活记录';
        return {
          publishedCaptions: [text, ...state.publishedCaptions],
        };
      }),
  }),
  {
    exclude: ['captionExpanded', 'fullscreenMode'],
  },
);
