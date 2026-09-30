export interface PinduoduoProduct {
  id: string;
  title: string;
  price: number;
  priceText: string;
  pricePrefix?: string;
  originalPriceText?: string;
  promoTag?: string;
  salesText: string;
  shopName: string;
  imageKey:
    | 'iqoo15t'
    | 'trashbag'
    | 'subsidy_item1'
    | 'subsidy_item2'
    | 'subsidy_item3'
    | 'ddmc_item1'
    | 'ddmc_item2';
  category: string;
  specs: string[];
  reviewSummary: string;
  reviewUser: string;
  reviewContent: string;
}

export interface PinduoduoOrderItem {
  productId: string;
  quantity: number;
  spec: string;
  statusText: string;
}

export interface PinduoduoChatItem {
  id: string;
  sender: string;
  tag: string;
  preview: string;
  timeText: string;
  unread: number;
}

export interface PinduoduoVideoPost {
  id: string;
  author: string;
  title: string;
  likes: number;
  liked: boolean;
  followed: boolean;
  linkedProductId: string;
  imageKey: 'iqoo15t' | 'trashbag' | 'subsidy_item1';
}

export interface PinduoduoUserProfile {
  nickname: string;
  pddId: string;
  couponsCount: number;
  followedShopsCount: number;
  footprintsCount: number;
  pxqUpdatesCount: number;
}
