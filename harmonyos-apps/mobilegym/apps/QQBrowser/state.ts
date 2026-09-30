import { createAppStoreWithActions } from '../../os/createAppStore';
import {
  QQBROWSER_CONFIG,
  type QQBrowserArticle,
  type QQBrowserNovel,
  type QQBrowserFileItem,
  type QQBrowserUserProfile,
} from './data';

interface QQBrowserState {
  user: QQBrowserUserProfile;
  articles: QQBrowserArticle[];
  novels: QQBrowserNovel[];
  files: QQBrowserFileItem[];
  searchHistory: string[];
  searchHotKeywords: string[];
  qbotModeActive: boolean;
  voicePromptOpen: boolean;
}

interface QQBrowserActions {
  toggleQbotMode: () => void;
  toggleArticleLike: (articleId: string) => void;
  toggleArticleBookmark: (articleId: string) => void;
  addArticleComment: (articleId: string, text: string) => void;
  toggleNovelBookshelf: (novelId: string) => void;
  toggleFileStar: (fileId: string) => void;
  deleteFile: (fileId: string) => void;
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;
}

const initialState: QQBrowserState = {
  user: QQBROWSER_CONFIG.user,
  articles: [...QQBROWSER_CONFIG.articles],
  novels: [...QQBROWSER_CONFIG.novels],
  files: [...QQBROWSER_CONFIG.files],
  searchHistory: ['DeepSeek 满血版在线体验', 'HarmonyOS NEXT 原生应用'],
  searchHotKeywords: [...QQBROWSER_CONFIG.searchHotKeywords],
  qbotModeActive: false,
  voicePromptOpen: false,
};

export const useQQBrowserStore = createAppStoreWithActions<QQBrowserState, QQBrowserActions>(
  'qqbrowser',
  initialState,
  (set) => ({
    toggleQbotMode: () =>
      set((state) => ({
        qbotModeActive: !state.qbotModeActive,
      })),

    toggleArticleLike: (articleId) =>
      set((state) => ({
        articles: state.articles.map((a) =>
          a.id === articleId
            ? { ...a, liked: !a.liked, likes: a.liked ? a.likes - 1 : a.likes + 1 }
            : a,
        ),
      })),

    toggleArticleBookmark: (articleId) =>
      set((state) => ({
        articles: state.articles.map((a) =>
          a.id === articleId ? { ...a, bookmarked: !a.bookmarked } : a,
        ),
      })),

    addArticleComment: (articleId, text) =>
      set((state) => {
        const trimmed = text.trim();
        if (!trimmed) return state;
        return {
          articles: state.articles.map((a) =>
            a.id === articleId
              ? {
                  ...a,
                  comments: [
                    {
                      id: `c_${Date.now()}`,
                      user: state.user.nickname,
                      text: trimmed,
                      timeText: '刚刚',
                    },
                    ...a.comments,
                  ],
                }
              : a,
          ),
        };
      }),

    toggleNovelBookshelf: (novelId) =>
      set((state) => ({
        novels: state.novels.map((n) =>
          n.id === novelId ? { ...n, inBookshelf: !n.inBookshelf } : n,
        ),
      })),

    toggleFileStar: (fileId) =>
      set((state) => ({
        files: state.files.map((f) =>
          f.id === fileId ? { ...f, starred: !f.starred } : f,
        ),
      })),

    deleteFile: (fileId) =>
      set((state) => ({
        files: state.files.filter((f) => f.id !== fileId),
      })),

    addSearchHistory: (keyword) =>
      set((state) => {
        const trimmed = keyword.trim();
        if (!trimmed) return state;
        const next = [trimmed, ...state.searchHistory.filter((k) => k !== trimmed)].slice(0, 10);
        return { searchHistory: next };
      }),

    clearSearchHistory: () => set({ searchHistory: [] }),
  }),
);
