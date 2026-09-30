import { createAppStoreWithActions } from '../../os/createAppStore';
import {
  TAOBAO_CONFIG,
  type TaobaoProduct,
  type TaobaoCartItem,
  type TaobaoMessageItem,
  type TaobaoVideoPost,
  type TaobaoUserProfile,
} from './data';

interface TaobaoState {
  user: TaobaoUserProfile;
  products: TaobaoProduct[];
  cart: TaobaoCartItem[];
  favoriteIds: string[];
  searchHistory: string[];
  searchDiscover: string[];
  messages: TaobaoMessageItem[];
  videos: TaobaoVideoPost[];
  promoCouponClaimed: boolean;
  lastOrderSuccess: boolean;
}

interface TaobaoActions {
  claimPromoCoupon: () => void;
  toggleFavorite: (productId: string) => void;
  addToCart: (productId: string, spec?: string) => void;
  toggleCartItem: (productId: string) => void;
  toggleAllCartItems: (selected: boolean) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  checkoutCart: () => void;
  clearOrderSuccess: () => void;
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;
  markAllMessagesRead: () => void;
  markMessageRead: (id: string) => void;
  toggleVideoLike: (videoId: string) => void;
  toggleVideoFollow: (videoId: string) => void;
}

const initialState: TaobaoState = {
  user: TAOBAO_CONFIG.user,
  products: [...TAOBAO_CONFIG.products],
  cart: [...TAOBAO_CONFIG.initialCart],
  favoriteIds: ['prod_anta_3'],
  searchHistory: ['机械键盘客制化', '越野跑鞋'],
  searchDiscover: [...TAOBAO_CONFIG.searchDiscover],
  messages: [...TAOBAO_CONFIG.messages],
  videos: [...TAOBAO_CONFIG.videos],
  promoCouponClaimed: false,
  lastOrderSuccess: false,
};

export const useTaobaoStore = createAppStoreWithActions<TaobaoState, TaobaoActions>(
  'taobao',
  initialState,
  (set) => ({
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

    addToCart: (productId, spec) =>
      set((state) => {
        const product = state.products.find((p) => p.id === productId);
        const defaultSpec = spec || product?.specs[0] || '默认规格';
        const existing = state.cart.find((item) => item.productId === productId);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + 1, selected: true }
                : item,
            ),
          };
        }
        return {
          cart: [
            ...state.cart,
            {
              productId,
              quantity: 1,
              selected: true,
              spec: defaultSpec,
            },
          ],
        };
      }),

    toggleCartItem: (productId) =>
      set((state) => ({
        cart: state.cart.map((item) =>
          item.productId === productId ? { ...item, selected: !item.selected } : item,
        ),
      })),

    toggleAllCartItems: (selected) =>
      set((state) => ({
        cart: state.cart.map((item) => ({ ...item, selected })),
      })),

    updateCartQuantity: (productId, delta) =>
      set((state) => ({
        cart: state.cart
          .map((item) =>
            item.productId === productId
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

    markAllMessagesRead: () =>
      set((state) => ({
        messages: state.messages.map((m) => ({ ...m, unread: 0 })),
      })),

    markMessageRead: (id) =>
      set((state) => ({
        messages: state.messages.map((m) => (m.id === id ? { ...m, unread: 0 } : m)),
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
  {
    exclude: ['lastOrderSuccess'],
  },
);
