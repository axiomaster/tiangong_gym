import defaults from './defaults.json';
import type {
  TaobaoProduct,
  TaobaoCartItem,
  TaobaoMessageItem,
  TaobaoVideoPost,
  TaobaoUserProfile,
} from '../types';

import imgSearchScan from '../assets/images/search_scan.png';
import imgSearchCamera from '../assets/images/search_camera.png';
import imgKkTmallNew from '../assets/images/kk_tmall_new.png';
import imgKkDailyCash from '../assets/images/kk_daily_cash.png';
import imgKkBabaFarm from '../assets/images/kk_baba_farm.png';
import imgKkTopup from '../assets/images/kk_topup.png';
import imgKk88Vip from '../assets/images/kk_88vip.png';
import imgKkTaoCoins from '../assets/images/kk_taocoins.png';
import imgLiveBadge from '../assets/images/live_badge.png';
import imgCardLive from '../assets/images/card_live.png';
import imgCardSubsidy from '../assets/images/card_subsidy.png';
import imgCardSeckill from '../assets/images/card_seckill.png';
import imgPromoIcon from '../assets/images/promo_icon.png';
import imgPromoTitle from '../assets/images/promo_title.png';
import imgPromoBtn from '../assets/images/promo_btn.png';
import imgProdAntaShoes from '../assets/images/prod_anta_shoes.png';
import imgProdPlaidShirt from '../assets/images/prod_plaid_shirt.png';
import imgBadgeTmall from '../assets/images/badge_tmall.png';
import imgBadgeReturn from '../assets/images/badge_return.png';
import imgTabHomeActive from '../assets/images/tab_home_active.png';
import imgTabVideo from '../assets/images/tab_video.png';
import imgTabMessage from '../assets/images/tab_message.png';
import imgTabCart from '../assets/images/tab_cart.png';
import imgTabMe from '../assets/images/tab_me.png';

export * from '../types';

export const TAOBAO_ASSETS = {
  searchScan: imgSearchScan,
  searchCamera: imgSearchCamera,
  kkTmallNew: imgKkTmallNew,
  kkDailyCash: imgKkDailyCash,
  kkBabaFarm: imgKkBabaFarm,
  kkTopup: imgKkTopup,
  kk88Vip: imgKk88Vip,
  kkTaoCoins: imgKkTaoCoins,
  liveBadge: imgLiveBadge,
  cardLive: imgCardLive,
  cardSubsidy: imgCardSubsidy,
  cardSeckill: imgCardSeckill,
  promoIcon: imgPromoIcon,
  promoTitle: imgPromoTitle,
  promoBtn: imgPromoBtn,
  prodAntaShoes: imgProdAntaShoes,
  prodPlaidShirt: imgProdPlaidShirt,
  badgeTmall: imgBadgeTmall,
  badgeReturn: imgBadgeReturn,
  tabHomeActive: imgTabHomeActive,
  tabVideo: imgTabVideo,
  tabMessage: imgTabMessage,
  tabCart: imgTabCart,
  tabMe: imgTabMe,
} as const;

export function getProductImage(key: TaobaoProduct['imageKey'] | 'live_stream'): string {
  switch (key) {
    case 'anta_shoes':
      return TAOBAO_ASSETS.prodAntaShoes;
    case 'plaid_shirt':
      return TAOBAO_ASSETS.prodPlaidShirt;
    case 'subsidy_phone':
      return TAOBAO_ASSETS.cardSubsidy;
    case 'seckill_deal':
      return TAOBAO_ASSETS.cardSeckill;
    case 'live_stream':
      return TAOBAO_ASSETS.cardLive;
    default:
      return TAOBAO_ASSETS.prodAntaShoes;
  }
}

export const TAOBAO_CONFIG = {
  user: defaults.user as TaobaoUserProfile,
  searchPlaceholders: defaults.searchPlaceholders as string[],
  searchDiscover: defaults.searchDiscover as string[],
  products: defaults.products as TaobaoProduct[],
  initialCart: defaults.initialCart as TaobaoCartItem[],
  messages: defaults.messages as TaobaoMessageItem[],
  videos: defaults.videos as TaobaoVideoPost[],
} as const;
