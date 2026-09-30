import { createAppStoreWithActions } from '../../os/createAppStore';
import {
  BAIDU_NETDISK_CONFIG,
  type BaiduFileItem,
  type BaiduMemoryCard,
  type BaiduAiPrompt,
  type BaiduShareGroup,
  type BaiduUserProfile,
} from './data';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  linkedFileId?: string;
}

interface BaiduNetdiskState {
  user: BaiduUserProfile;
  files: BaiduFileItem[];
  memories: BaiduMemoryCard[];
  aiPrompts: BaiduAiPrompt[];
  shareGroups: BaiduShareGroup[];
  searchHistory: string[];
  searchDiscover: string[];
  transferTab: 'transfer' | 'subscribe';
  hiddenSections: string[];
  aiMessages: AiChatMessage[];
}

interface BaiduNetdiskActions {
  setTransferTab: (tab: 'transfer' | 'subscribe') => void;
  toggleSectionPrivacy: (section: string) => void;
  toggleFileStar: (fileId: string) => void;
  triggerFileDownload: (fileId: string) => void;
  askAiPrompt: (promptId: string) => void;
  clearAiHistory: () => void;
  markAllSharesRead: () => void;
  markShareGroupRead: (id: string) => void;
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;
}

const initialState: BaiduNetdiskState = {
  user: BAIDU_NETDISK_CONFIG.user,
  files: [...BAIDU_NETDISK_CONFIG.files],
  memories: [...BAIDU_NETDISK_CONFIG.memories],
  aiPrompts: [...BAIDU_NETDISK_CONFIG.aiPrompts],
  shareGroups: [...BAIDU_NETDISK_CONFIG.shareGroups],
  searchHistory: ['PP-OCRv5_server-onnx', '猫meme 表情包'],
  searchDiscover: [...BAIDU_NETDISK_CONFIG.searchDiscover],
  transferTab: 'transfer',
  hiddenSections: [],
  aiMessages: [
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: '你好！我是百度网盘智能助理「库库AI」，可以帮你极速检索网盘文件、总结课程讲义或查找回忆照片。',
      linkedFileId: 'file_pp_ocr',
    },
  ],
};

export const useBaiduNetdiskStore = createAppStoreWithActions<
  BaiduNetdiskState,
  BaiduNetdiskActions
>('baidunetdisk', initialState, (set) => ({
  setTransferTab: (tab) => set({ transferTab: tab }),

  toggleSectionPrivacy: (section) =>
    set((state) => {
      const exists = state.hiddenSections.includes(section);
      return {
        hiddenSections: exists
          ? state.hiddenSections.filter((s) => s !== section)
          : [...state.hiddenSections, section],
      };
    }),

  toggleFileStar: (fileId) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === fileId ? { ...f, starred: !f.starred } : f)),
    })),

  triggerFileDownload: (fileId) =>
    set((state) => {
      const target = state.files.find((f) => f.id === fileId);
      const alreadyDownloaded = target?.downloaded ?? false;
      return {
        files: state.files.map((f) => (f.id === fileId ? { ...f, downloaded: true } : f)),
        user: alreadyDownloaded
          ? state.user
          : { ...state.user, transferCount: state.user.transferCount + 1 },
      };
    }),

  askAiPrompt: (promptId) =>
    set((state) => {
      const prompt = state.aiPrompts.find((p) => p.id === promptId);
      if (!prompt) return state;
      const linkedFileId =
        promptId === 'prompt_ocr'
          ? 'file_pp_ocr'
          : promptId === 'prompt_xian'
            ? 'file_xian_album'
            : 'file_course_hz';
      return {
        aiMessages: [
          ...state.aiMessages,
          { id: `u_${Date.now()}`, sender: 'user', text: prompt.title },
          {
            id: `a_${Date.now() + 1}`,
            sender: 'ai',
            text: prompt.reply,
            linkedFileId,
          },
        ],
      };
    }),

  clearAiHistory: () =>
    set({
      aiMessages: [
        {
          id: 'msg_welcome',
          sender: 'ai',
          text: '对话已重置。你可以点击下方快捷指令让库库AI帮你整理网盘资源。',
          linkedFileId: 'file_pp_ocr',
        },
      ],
    }),

  markAllSharesRead: () =>
    set((state) => ({
      shareGroups: state.shareGroups.map((g) => ({ ...g, unread: 0 })),
    })),

  markShareGroupRead: (id) =>
    set((state) => ({
      shareGroups: state.shareGroups.map((g) => (g.id === id ? { ...g, unread: 0 } : g)),
    })),

  addSearchHistory: (keyword) =>
    set((state) => {
      const trimmed = keyword.trim();
      if (!trimmed) return state;
      const next = [trimmed, ...state.searchHistory.filter((k) => k !== trimmed)].slice(0, 10);
      return { searchHistory: next };
    }),

  clearSearchHistory: () => set({ searchHistory: [] }),
}));
