import { createAppStoreWithActions } from '../../os/createAppStore';
import {
  MEITUAN_CONFIG,
  type MeituanDeal,
  type MeituanCartItem,
  type MeituanVideoPost,
  type MeituanXiaotuanTopic,
  type MeituanUserProfile,
} from './data';

interface MeituanState {
  user: MeituanUserProfile;
  deals: MeituanDeal[];
  cart: MeituanCartItem[];
  favoriteIds: string[];
  searchHistory: string[];
  searchDiscover: string[];
  videos: MeituanVideoPost[];
  xiaotuanTopics: MeituanXiaotuanTopic[];
  activeTopicId: string;
  locationSwitched: boolean;
  lastOrderSuccess: boolean;
}

interface MeituanActions {
  toggleLocation: () => void;
  toggleFavorite: (dealId: string) => void;
  addToCart: (dealId: string, spec?: string) => void;
  toggleCartItem: (dealId: string) => void;
  toggleAllCartItems: (selected: boolean) => void;
  updateCartQuantity: (dealId: string, delta: number) => void;
  checkoutCart: () => void;
  clearOrderSuccess: () => void;
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;
  selectXiaotuanTopic: (topicId: string) => void;
  toggleVideoLike: (videoId: string) => void;
  toggleVideoFollow: (videoId: string) => void;
}

const initialState: MeituanState = {
  user: MEITUAN_CONFIG.user,
  deals: [...MEITUAN_CONFIG.deals],
  cart: [...MEITUAN_CONFIG.initialCart],
  favoriteIds: ['deal_beifei'],
  searchHistory: ['麦当劳', '瑞幸咖啡生椰拿铁'],
  searchDiscover: [...MEITUAN_CONFIG.searchDiscover],
  videos: [...MEITUAN_CONFIG.videos],
  xiaotuanTopics: [...MEITUAN_CONFIG.xiaotuanTopics],
  activeTopicId: MEITUAN_CONFIG.xiaotuanTopics[0]?.id || 'topic_breakfast',
  locationSwitched: false,
  lastOrderSuccess: false,
};

export const useMeituanStore = createAppStoreWithActions<MeituanState, MeituanActions>(
  'meituan',
  initialState,
  (set) => ({
    toggleLocation: () =>
      set((state) => ({
        locationSwitched: !state.locationSwitched,
      })),

    toggleFavorite: (dealId) =>
      set((state) => {
        const exists = state.favoriteIds.includes(dealId);
        const nextIds = exists
          ? state.favoriteIds.filter((id) => id !== dealId)
          : [...state.favoriteIds, dealId];
        return { favoriteIds: nextIds };
      }),

    addToCart: (dealId, spec) =>
      set((state) => {
        const deal = state.deals.find((d) => d.id === dealId);
        const defaultSpec = spec || deal?.specs[0] || '默认规格';
        const existing = state.cart.find((item) => item.dealId === dealId);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.dealId === dealId
                ? { ...item, quantity: item.quantity + 1, selected: true }
                : item,
            ),
          };
        }
        return {
          cart: [
            ...state.cart,
            {
              dealId,
              quantity: 1,
              selected: true,
              spec: defaultSpec,
            },
          ],
        };
      }),

    toggleCartItem: (dealId) =>
      set((state) => ({
        cart: state.cart.map((item) =>
          item.dealId === dealId ? { ...item, selected: !item.selected } : item,
        ),
      })),

    toggleAllCartItems: (selected) =>
      set((state) => ({
        cart: state.cart.map((item) => ({ ...item, selected })),
      })),

    updateCartQuantity: (dealId, delta) =>
      set((state) => ({
        cart: state.cart
          .map((item) =>
            item.dealId === dealId
              ? { ...item, quantity: Math.max(0, item.quantity + delta) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      })),

    checkoutCart: () =>
      set((state) => ({
        cart: state.cart.filter((item) => !item.selected),
        lastOrderSuccess: true,
      })),

    clearOrderSuccess: () => set({ lastOrderSuccess: false }),

    addSearchHistory: (keyword) =>
      set((state) => {
        const trimmed = keyword.trim();
        if (!trimmed) return state;
        const next = [trimmed, ...state.searchHistory.filter((k) => k !== trimmed)].slice(0, 10);
        return { searchHistory: next };
      }),

    clearSearchHistory: () => set({ searchHistory: [] }),

    selectXiaotuanTopic: (topicId) =>
      set(() => ({
        activeTopicId: topicId,
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
