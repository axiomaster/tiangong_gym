import defaults from './defaults.json';
import type {
  PinduoduoProduct,
  PinduoduoOrderItem,
  PinduoduoChatItem,
  PinduoduoVideoPost,
  PinduoduoUserProfile,
} from '../types';

import imgSearchIcon from '../assets/images/search_icon.png';
import imgSearchCamera from '../assets/images/search_camera.png';
import imgPxqAvatar from '../assets/images/pxq_avatar.png';
import imgPxqArrow from '../assets/images/pxq_arrow.png';
import imgKkSeckill from '../assets/images/kk_seckill.png';
import imgKkTopup from '../assets/images/kk_topup.png';
import imgKkWheel from '../assets/images/kk_wheel.png';
import imgKkFruit from '../assets/images/kk_fruit.png';
import imgDdmcItem1 from '../assets/images/ddmc_item1.png';
import imgDdmcItem2 from '../assets/images/ddmc_item2.png';
import imgDdmcItem3 from '../assets/images/ddmc_item3.png';
import imgDdmcItem4 from '../assets/images/ddmc_item4.png';
import imgSubsidyItem1 from '../assets/images/subsidy_item1.png';
import imgSubsidyItem2 from '../assets/images/subsidy_item2.png';
import imgSubsidyItem3 from '../assets/images/subsidy_item3.png';
import imgProdIqoo15t from '../assets/images/prod_iqoo15t.png';
import imgProdTrashbag from '../assets/images/prod_trashbag.png';
import imgTabHome from '../assets/images/tab_home.png';
import imgTabVideo from '../assets/images/tab_video.png';
import imgTabPromo from '../assets/images/tab_promo.png';
import imgTabChat from '../assets/images/tab_chat.png';
import imgTabMe from '../assets/images/tab_me.png';

export * from '../types';

export const PINDUODUO_ASSETS = {
  searchIcon: imgSearchIcon,
  searchCamera: imgSearchCamera,
  pxqAvatar: imgPxqAvatar,
  pxqArrow: imgPxqArrow,
  kkSeckill: imgKkSeckill,
  kkTopup: imgKkTopup,
  kkWheel: imgKkWheel,
  kkFruit: imgKkFruit,
  ddmcItem1: imgDdmcItem1,
  ddmcItem2: imgDdmcItem2,
  ddmcItem3: imgDdmcItem3,
  ddmcItem4: imgDdmcItem4,
  subsidyItem1: imgSubsidyItem1,
  subsidyItem2: imgSubsidyItem2,
  subsidyItem3: imgSubsidyItem3,
  prodIqoo15t: imgProdIqoo15t,
  prodTrashbag: imgProdTrashbag,
  tabHome: imgTabHome,
  tabVideo: imgTabVideo,
  tabPromo: imgTabPromo,
  tabChat: imgTabChat,
  tabMe: imgTabMe,
} as const;

export function getProductImage(key: PinduoduoProduct['imageKey']): string {
  switch (key) {
    case 'iqoo15t':
      return PINDUODUO_ASSETS.prodIqoo15t;
    case 'trashbag':
      return PINDUODUO_ASSETS.prodTrashbag;
    case 'subsidy_item1':
      return PINDUODUO_ASSETS.subsidyItem1;
    case 'subsidy_item2':
      return PINDUODUO_ASSETS.subsidyItem2;
    case 'subsidy_item3':
      return PINDUODUO_ASSETS.subsidyItem3;
    case 'ddmc_item1':
      return PINDUODUO_ASSETS.ddmcItem1;
    case 'ddmc_item2':
      return PINDUODUO_ASSETS.ddmcItem2;
    default:
      return PINDUODUO_ASSETS.prodIqoo15t;
  }
}

export const PINDUODUO_CONFIG = {
  user: defaults.user as PinduoduoUserProfile,
  searchPlaceholders: defaults.searchPlaceholders as string[],
  searchDiscover: defaults.searchDiscover as string[],
  products: defaults.products as PinduoduoProduct[],
  initialOrders: defaults.initialOrders as PinduoduoOrderItem[],
  chats: defaults.chats as PinduoduoChatItem[],
  videos: defaults.videos as PinduoduoVideoPost[],
} as const;
