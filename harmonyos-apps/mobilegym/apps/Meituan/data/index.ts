import defaults from './defaults.json';
import type {
  MeituanDeal,
  MeituanDealImageKey,
  MeituanCartItem,
  MeituanVideoPost,
  MeituanXiaotuanTopic,
  MeituanUserProfile,
} from '../types';

import imgIcLocation from '../assets/images/ic_location.png';
import imgIcMessage from '../assets/images/ic_message.png';
import imgIcScan from '../assets/images/ic_scan.png';
import imgKkWaimai from '../assets/images/kk_waimai.png';
import imgKkGroupon from '../assets/images/kk_groupon.png';
import imgKkHotel from '../assets/images/kk_hotel.png';
import imgKkInstashop from '../assets/images/kk_instashop.png';
import imgKkMedicine from '../assets/images/kk_medicine.png';
import imgKkXiaoxiang from '../assets/images/kk_xiaoxiang.png';
import imgKkFood from '../assets/images/kk_food.png';
import imgKkLeisure from '../assets/images/kk_leisure.png';
import imgKkTravel from '../assets/images/kk_travel.png';
import imgKkMovie from '../assets/images/kk_movie.png';
import imgKkLoan from '../assets/images/kk_loan.png';
import imgKkMassage from '../assets/images/kk_massage.png';
import imgKkErrand from '../assets/images/kk_errand.png';
import imgKkFruit from '../assets/images/kk_fruit.png';
import imgKkMore from '../assets/images/kk_more.png';
import imgLogoTejiatuan from '../assets/images/logo_tejiatuan.png';
import imgDealHulatang from '../assets/images/deal_hulatang.png';
import imgDealLuckin from '../assets/images/deal_luckin.png';
import imgCardXiaoxiang from '../assets/images/card_xiaoxiang.png';
import imgBadgeZiying from '../assets/images/badge_ziying.png';
import imgHotelBeifei from '../assets/images/hotel_beifei.png';
import imgHotelTianlun from '../assets/images/hotel_tianlun.png';
import imgTabHomeActive from '../assets/images/tab_home_active.png';
import imgTabVideo from '../assets/images/tab_video.png';
import imgTabXiaotuan from '../assets/images/tab_xiaotuan.png';
import imgTabCart from '../assets/images/tab_cart.png';
import imgTabMe from '../assets/images/tab_me.png';

export * from '../types';

export const MEITUAN_ASSETS = {
  icLocation: imgIcLocation,
  icMessage: imgIcMessage,
  icScan: imgIcScan,
  kkWaimai: imgKkWaimai,
  kkGroupon: imgKkGroupon,
  kkHotel: imgKkHotel,
  kkInstashop: imgKkInstashop,
  kkMedicine: imgKkMedicine,
  kkXiaoxiang: imgKkXiaoxiang,
  kkFood: imgKkFood,
  kkLeisure: imgKkLeisure,
  kkTravel: imgKkTravel,
  kkMovie: imgKkMovie,
  kkLoan: imgKkLoan,
  kkMassage: imgKkMassage,
  kkErrand: imgKkErrand,
  kkFruit: imgKkFruit,
  kkMore: imgKkMore,
  logoTejiatuan: imgLogoTejiatuan,
  dealHulatang: imgDealHulatang,
  dealLuckin: imgDealLuckin,
  cardXiaoxiang: imgCardXiaoxiang,
  badgeZiying: imgBadgeZiying,
  hotelBeifei: imgHotelBeifei,
  hotelTianlun: imgHotelTianlun,
  tabHomeActive: imgTabHomeActive,
  tabVideo: imgTabVideo,
  tabXiaotuan: imgTabXiaotuan,
  tabCart: imgTabCart,
  tabMe: imgTabMe,
} as const;

export function getDealImage(key: MeituanDealImageKey): string {
  switch (key) {
    case 'hulatang':
      return MEITUAN_ASSETS.dealHulatang;
    case 'luckin':
      return MEITUAN_ASSETS.dealLuckin;
    case 'xiaoxiang':
      return MEITUAN_ASSETS.cardXiaoxiang;
    case 'hotel_beifei':
      return MEITUAN_ASSETS.hotelBeifei;
    case 'hotel_tianlun':
      return MEITUAN_ASSETS.hotelTianlun;
    default:
      return MEITUAN_ASSETS.dealHulatang;
  }
}

export const MEITUAN_CONFIG = {
  user: defaults.user as MeituanUserProfile,
  searchPlaceholders: defaults.searchPlaceholders as string[],
  searchDiscover: defaults.searchDiscover as string[],
  deals: defaults.deals as MeituanDeal[],
  initialCart: defaults.initialCart as MeituanCartItem[],
  videos: defaults.videos as MeituanVideoPost[],
  xiaotuanTopics: defaults.xiaotuanTopics as MeituanXiaotuanTopic[],
} as const;
