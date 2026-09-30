import { createAppStoreWithActions } from '../../os/createAppStore';
import {
  PINDUODUO_CONFIG,
  type PinduoduoProduct,
  type PinduoduoOrderItem,
  type PinduoduoChatItem,
  type PinduoduoVideoPost,
  type PinduoduoUserProfile,
} from './data';

interface PinduoduoState {
  user: PinduoduoUserProfile;
  products: PinduoduoProduct[];
  orders: PinduoduoOrderItem[];
  favoriteIds: string[];
  searchHistory: string[];
  searchDiscover: string[];
  chats: PinduoduoChatItem[];
  videos: PinduoduoVideoPost[];
  pxqViewed: boolean;
  promoCouponClaimed: boolean;
}

interface PinduoduoActions {
  viewPxqUpdates: () => void;
  claimPromoCoupon: () => void;
  toggleFavorite: (productId: string) => void;
  joinGroupBuy: (productId: string, spec?: string) => void;
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;
  markAllChatsRead: () => void;
  markChatRead: (id: string) => void;
  toggleVideoLike: (videoId: string) => void;
  toggleVideoFollow: (videoId: string) => void;
}

const initialState: PinduoduoState = {
  user: PINDUODUO_CONFIG.user,
  products: [...PINDUODUO_CONFIG.products],
  orders: [...PINDUODUO_CONFIG.initialOrders],
  favoriteIds: ['prod_iqoo15t'],
  searchHistory: ['数据线快充超快闪充', 'iQOO 15T'],
  searchDiscover: [...PINDUODUO_CONFIG.searchDiscover],
  chats: [...PINDUODUO_CONFIG.chats],
  videos: [...PINDUODUO_CONFIG.videos],
  pxqViewed: false,
  promoCouponClaimed: false,
};

export const usePinduoduoStore = createAppStoreWithActions<PinduoduoState, PinduoduoActions>(
  'pinduoduo',
  initialState,
  (set) => ({
    viewPxqUpdates: () =>
      set((state) => ({
        pxqViewed: true,
        user: {
          ...state.user,
          pxqUpdatesCount: 0,
        },
      })),

    claimPromoCoupon: () =>
      set((state) => {
        if (state.promoCouponClaimed) return state;
        return {
          promoCouponClaimed: true,
          user: {
            ...state.user,
            couponsCount: state.user.couponsCount + 1,
          },
        };
      }),

    toggleFavorite: (productId) =>
      set((state) => {
        const exists = state.favoriteIds.includes(productId);
        const nextIds = exists
          ? state.favoriteIds.filter((id) => id !== productId)
          : [...state.favoriteIds, productId];
        return { favoriteIds: nextIds };
      }),

    joinGroupBuy: (productId, spec) =>
      set((state) => {
        const product = state.products.find((p) => p.id === productId);
        const defaultSpec = spec || product?.specs[0] || '默认规格';
        const existing = state.orders.find((o) => o.productId === productId);
        if (existing) {
          return {
            orders: state.orders.map((o) =>
              o.productId === productId
                ? { ...o, quantity: o.quantity + 1, statusText: '拼单成功 · 待发货' }
                : o,
            ),
          };
        }
        return {
          orders: [
            {
              productId,
              quantity: 1,
              spec: defaultSpec,
              statusText: '拼单成功 · 待发货',
            },
            ...state.orders,
          ],
        };
      }),

    addSearchHistory: (keyword) =>
      set((state) => {
        const trimmed = keyword.trim();
        if (!trimmed) return state;
        const next = [trimmed, ...state.searchHistory.filter((k) => k !== trimmed)].slice(0, 10);
        return { searchHistory: next };
      }),

    clearSearchHistory: () => set({ searchHistory: [] }),

    markAllChatsRead: () =>
      set((state) => ({
        chats: state.chats.map((c) => ({ ...c, unread: 0 })),
      })),

    markChatRead: (id) =>
      set((state) => ({
        chats: state.chats.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
      })),

    toggleVideoLike: (videoId) =>
      set((state) => ({
        videos: state.videos.map((v) =>
          v.id === videoId
            ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 }
            : v,
        ),
      })),

    toggleVideoFollow: (videoId) =>
      set((state) => ({
        videos: state.videos.map((v) =>
          v.id === videoId ? { ...v, followed: !v.followed } : v,
        ),
      })),
  }),
);
