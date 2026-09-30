export type MeituanDealImageKey =
  | 'hulatang'
  | 'luckin'
  | 'xiaoxiang'
  | 'hotel_beifei'
  | 'hotel_tianlun';

export interface MeituanDeal {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  price: number;
  priceText: string;
  priceSuffix?: string;
  originalPriceText?: string;
  discountText?: string;
  salesText: string;
  shopName: string;
  badgeType: '酒店' | '团购' | '自营' | '特价团';
  locationOrDistance: string;
  ratingText?: string;
  highlightText?: string;
  imageKey: MeituanDealImageKey;
  category: string;
  specs: string[];
  reviewSummary: string;
  reviewUser: string;
  reviewContent: string;
}

export interface MeituanCartItem {
  dealId: string;
  quantity: number;
  selected: boolean;
  spec: string;
}

export interface MeituanVideoPost {
  id: string;
  author: string;
  title: string;
  likes: number;
  liked: boolean;
  followed: boolean;
  linkedDealId: string;
  imageKey: MeituanDealImageKey;
}

export interface MeituanXiaotuanTopic {
  id: string;
  prompt: string;
  reply: string;
  recommendedDealId: string;
}

export interface MeituanUserProfile {
  nickname: string;
  mtAccount: string;
  couponsCount: number;
  redPacketsCount: number;
  followedShopsCount: number;
  footprintsCount: number;
}
