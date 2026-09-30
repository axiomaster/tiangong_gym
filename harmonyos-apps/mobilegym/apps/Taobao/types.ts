export interface TaobaoProduct {
  id: string;
  title: string;
  price: number;
  priceText: string;
  originalPriceText?: string;
  salesText: string;
  shopName: string;
  isTmall: boolean;
  hasReturnInsurance: boolean;
  imageKey: 'anta_shoes' | 'plaid_shirt' | 'subsidy_phone' | 'seckill_deal';
  category: string;
  specs: string[];
  reviewSummary: string;
  reviewUser: string;
  reviewContent: string;
}

export interface TaobaoCartItem {
  productId: string;
  quantity: number;
  selected: boolean;
  spec: string;
}

export interface TaobaoMessageItem {
  id: string;
  sender: string;
  tag: string;
  preview: string;
  timeText: string;
  unread: number;
}

export interface TaobaoVideoPost {
  id: string;
  author: string;
  title: string;
  likes: number;
  liked: boolean;
  followed: boolean;
  linkedProductId: string;
  imageKey: 'anta_shoes' | 'plaid_shirt' | 'live_stream';
}

export interface TaobaoUserProfile {
  nickname: string;
  tbAccount: string;
  taoCoins: number;
  couponsCount: number;
  followedShopsCount: number;
  footprintsCount: number;
}
