import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useMeituanStrings } from '../hooks/useMeituanStrings';
import { useMeituanGestures } from '../hooks/useMeituanGestures';
import { useMeituanStore } from '../state';
import { MEITUAN_ASSETS, getDealImage } from '../data';
import { IcNavForward } from '../res/icons';

export const HomePage: React.FC = () => {
  const s = useMeituanStrings();
  const { bindTap } = useMeituanGestures();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const { deals, locationSwitched } = useMeituanStore(
    useShallow((st) => ({
      deals: st.deals,
      locationSwitched: st.locationSwitched,
    })),
  );
  const toggleLocation = useMeituanStore((st) => st.toggleLocation);

  const kingkongItems: Array<{
    id: string;
    label: string;
    icon: string;
    category: string;
    badge?: string;
  }> = [
    {
      id: 'waimai',
      label: s.kk_waimai,
      icon: MEITUAN_ASSETS.kkWaimai,
      category: 'waimai',
      badge: s.badge_buy_gift,
    },
    {
      id: 'groupon',
      label: s.kk_groupon,
      icon: MEITUAN_ASSETS.kkGroupon,
      category: 'groupon',
    },
    {
      id: 'hotel',
      label: s.kk_hotel,
      icon: MEITUAN_ASSETS.kkHotel,
      category: 'hotel',
    },
    {
      id: 'instashop',
      label: s.kk_instashop,
      icon: MEITUAN_ASSETS.kkInstashop,
      category: 'xiaoxiang',
    },
    {
      id: 'medicine',
      label: s.kk_medicine,
      icon: MEITUAN_ASSETS.kkMedicine,
      category: 'all',
    },
    {
      id: 'xiaoxiang',
      label: s.kk_xiaoxiang,
      icon: MEITUAN_ASSETS.kkXiaoxiang,
      category: 'xiaoxiang',
    },
    {
      id: 'food',
      label: s.kk_food,
      icon: MEITUAN_ASSETS.kkFood,
      category: 'food',
      badge: s.badge_food_fest,
    },
    {
      id: 'leisure',
      label: s.kk_leisure,
      icon: MEITUAN_ASSETS.kkLeisure,
      category: 'groupon',
    },
    {
      id: 'travel',
      label: s.kk_travel,
      icon: MEITUAN_ASSETS.kkTravel,
      category: 'hotel',
    },
    {
      id: 'movie',
      label: s.kk_movie,
      icon: MEITUAN_ASSETS.kkMovie,
      category: 'all',
    },
    {
      id: 'loan',
      label: s.kk_loan,
      icon: MEITUAN_ASSETS.kkLoan,
      category: 'all',
    },
    {
      id: 'massage',
      label: s.kk_massage,
      icon: MEITUAN_ASSETS.kkMassage,
      category: 'groupon',
    },
    {
      id: 'errand',
      label: s.kk_errand,
      icon: MEITUAN_ASSETS.kkErrand,
      category: 'waimai',
    },
    {
      id: 'fruit',
      label: s.kk_fruit,
      icon: MEITUAN_ASSETS.kkFruit,
      category: 'xiaoxiang',
    },
    {
      id: 'more',
      label: s.kk_more,
      icon: MEITUAN_ASSETS.kkMore,
      category: 'all',
    },
  ];

  const feedDeals = deals.filter(
    (d) =>
      d.id === 'deal_beifei' ||
      d.id === 'deal_tianlun' ||
      d.id === 'deal_chaoroupian' ||
      (activeCategory !== 'all' && d.category === activeCategory),
  );

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6]"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Yellow Meituan Header */}
      <div className="bg-[#FFD100] pt-10 pb-2.5 px-3">
        {/* Location & Action Icons Row */}
        <div className="flex items-center justify-between mb-2">
          <div
            {...bindTap(
              { kind: 'action', id: 'home.location.switch' },
              { onTrigger: () => toggleLocation() },
            )}
            className="flex items-center gap-1 cursor-pointer active:opacity-80"
          >
            <img
              src={MEITUAN_ASSETS.icLocation}
              alt="location"
              className="w-4 h-4 object-contain"
            />
            <span className="text-[15px] font-bold text-[#111111] tracking-tight">
              {locationSwitched ? s.location_alt : s.location_default}
            </span>
            <IcNavForward size={15} className="text-[#111111] stroke-[2.4]" />
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src={MEITUAN_ASSETS.icMessage}
              alt="message"
              className="w-[22px] h-[22px] object-contain"
            />
            <img
              src={MEITUAN_ASSETS.icScan}
              alt="scan"
              className="w-[22px] h-[22px] object-contain"
            />
          </div>
        </div>

        {/* White Pill Search Bar */}
        <div
          {...bindTap('home.search.open')}
          className="h-[36px] rounded-full bg-white pl-3.5 pr-1 flex items-center justify-between cursor-pointer active:opacity-95 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <span className="text-[14px] text-[#555555] font-medium truncate">
            {s.search_placeholder}
          </span>
          <div className="h-[29px] px-4 rounded-full bg-[#FFD100] text-[#111111] text-[13px] font-bold flex items-center justify-center">
            {s.search_btn}
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar pb-4 space-y-2"
        data-scroll-container="home-feed"
        data-scroll-direction="vertical"
      >
        {/* 3x5 15-Item Kingkong Grid */}
        <div className="bg-white rounded-b-[16px] pt-2 pb-2.5 px-2">
          <div className="grid grid-cols-5 gap-y-2.5 gap-x-1">
            {kingkongItems.map((item) => {
              const isSelected = activeCategory === item.category && item.category !== 'all';
              return (
                <div
                  key={item.id}
                  {...bindTap('home.category.switch', { params: { category: item.category } })}
                  className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                >
                  {item.badge && (
                    <span className="absolute -top-1 right-1 z-10 bg-[#FF3B27] text-white text-[9px] font-bold px-1.5 py-[1px] rounded-full leading-tight shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-[46px] h-[42px] object-contain"
                  />
                  <span
                    className={`text-[11px] mt-0.5 whitespace-nowrap ${
                      isSelected
                        ? 'text-[#FF4A00] font-bold'
                        : 'text-[#111111] font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pagination Indicator */}
          <div className="mt-2 flex items-center justify-center gap-1">
            <div className="w-3.5 h-1 rounded-full bg-[#FFD100]" />
            <div className="w-1.5 h-1 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* 2-Column Promo Section: Left 特价团 | Right 小象超市 */}
        <div className="px-2 grid grid-cols-2 gap-2">
          {/* Left: 特价团 天天有低价 */}
          <div className="bg-white rounded-[12px] p-2.5 flex flex-col justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 min-w-0">
                <img
                  src={MEITUAN_ASSETS.logoTejiatuan}
                  alt={s.promo_tejiatuan_title}
                  className="h-[18px] object-contain"
                />
                <span className="bg-[#FF4E33] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap">
                  {s.promo_tejiatuan_sub}
                </span>
              </div>
              <IcNavForward size={13} className="text-[#999999] flex-shrink-0" />
            </div>

            {/* Deal 1: 邢老四肉丸胡辣汤腊牛肉夹馍 ¥9.4 */}
            <div
              {...bindTap('home.deal.open', { params: { id: 'deal_hulatang' } })}
              className="flex gap-2 cursor-pointer active:opacity-85 mb-2"
            >
              <img
                src={MEITUAN_ASSETS.dealHulatang}
                alt="邢老四肉丸胡辣汤腊牛肉夹馍"
                className="w-[68px] h-[68px] rounded-[8px] object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="text-[12px] font-semibold text-[#111111] leading-[1.25] line-clamp-2">
                  邢老四肉丸胡辣汤腊牛肉夹馍
                </div>
                <div>
                  <span className="inline-block text-[9px] text-[#FF2D19] bg-[#FFF0ED] px-1 py-[1px] rounded">
                    180天最低价
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-bold text-[#FF2D19]">{s.currency_symbol}</span>
                  <span className="text-[15px] font-extrabold text-[#FF2D19] leading-none">
                    9.4
                  </span>
                  <span className="text-[10px] text-[#999999] line-through">¥15</span>
                </div>
              </div>
            </div>

            {/* Deal 2: 瑞幸咖啡【瑞门必喝】 ¥9.99 */}
            <div
              {...bindTap('home.deal.open', { params: { id: 'deal_luckin' } })}
              className="flex gap-2 cursor-pointer active:opacity-85"
            >
              <img
                src={MEITUAN_ASSETS.dealLuckin}
                alt="瑞幸咖啡【瑞门必喝】"
                className="w-[68px] h-[68px] rounded-[8px] object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="text-[12px] font-semibold text-[#111111] leading-[1.25] line-clamp-2">
                  瑞幸咖啡【瑞门必喝】
                </div>
                <div>
                  <span className="inline-block text-[9px] text-[#FF2D19] bg-[#FFF0ED] px-1 py-[1px] rounded">
                    5折
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-bold text-[#FF2D19]">{s.currency_symbol}</span>
                  <span className="text-[15px] font-extrabold text-[#FF2D19] leading-none">
                    9.99
                  </span>
                  <span className="text-[10px] text-[#999999] line-through">¥20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 小象超市 美团自营 生鲜零食百货一站购 最快30分钟 */}
          <div
            {...bindTap('home.deal.open', { params: { id: 'deal_xiaoxiang' } })}
            className="bg-white rounded-[12px] overflow-hidden flex flex-col justify-between cursor-pointer active:opacity-90 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
          >
            <div className="relative w-full aspect-[5/4] bg-[#F7FCF7] overflow-hidden">
              <img
                src={MEITUAN_ASSETS.cardXiaoxiang}
                alt={s.promo_xiaoxiang_title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-2 flex items-center rounded-[4px] overflow-hidden text-[10px] font-bold">
                <span className="bg-[#38B03F] text-white px-1.5 py-0.5">
                  {s.promo_xiaoxiang_title}
                </span>
                <span className="bg-black/65 text-white px-1.5 py-0.5">
                  {s.promo_xiaoxiang_speed}
                </span>
              </div>
            </div>

            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-1">
                <img
                  src={MEITUAN_ASSETS.badgeZiying}
                  alt={s.promo_xiaoxiang_self}
                  className="h-4 object-contain flex-shrink-0"
                />
                <span className="text-[13px] font-bold text-[#111111] truncate">
                  {s.promo_xiaoxiang_store}
                </span>
              </div>
              <div className="text-[10px] text-[#50607A] truncate mt-0.5">
                {s.promo_xiaoxiang_self} · {s.promo_xiaoxiang_slogan}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                <span className="text-[#FF2D19] font-semibold">{s.promo_xiaoxiang_freight}</span>
                <span className="text-[#888888]">{s.promo_xiaoxiang_sales}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Waterfall Feed Cards */}
        <div className="px-2 grid grid-cols-2 gap-2">
          {feedDeals.map((deal) => (
            <div
              key={deal.id}
              {...bindTap('home.deal.open', { params: { id: deal.id } })}
              className="bg-white rounded-[12px] overflow-hidden flex flex-col cursor-pointer active:opacity-95 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
            >
              <div className="relative w-full aspect-[5/4] bg-gray-100 overflow-hidden">
                <img
                  src={getDealImage(deal.imageKey)}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-2 flex items-center rounded-[4px] overflow-hidden text-[10px] font-bold">
                  <span
                    className={`px-1.5 py-0.5 text-white ${
                      deal.badgeType === '酒店' ? 'bg-[#2878FF]' : 'bg-[#FF6600]'
                    }`}
                  >
                    {deal.badgeType}
                  </span>
                  <span className="bg-black/60 text-white px-1.5 py-0.5">
                    {deal.locationOrDistance}
                  </span>
                </div>
              </div>

              <div className="p-2.5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[13px] font-bold text-[#111111] leading-[1.3] line-clamp-2">
                    {deal.shortTitle}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] flex-wrap">
                    {deal.highlightText && (
                      <span className="text-[#D95B00] font-medium">{deal.highlightText}</span>
                    )}
                    {deal.ratingText && (
                      <span className="text-[#666666] font-medium">{deal.ratingText}</span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[11px] font-bold text-[#FF2D19]">
                      {s.currency_symbol}
                    </span>
                    <span className="text-[17px] font-extrabold text-[#FF2D19] leading-none">
                      {deal.priceText}
                    </span>
                    {deal.priceSuffix && (
                      <span className="text-[11px] text-[#FF2D19] font-semibold">
                        {deal.priceSuffix}
                      </span>
                    )}
                    {deal.discountText && (
                      <span className="ml-1 text-[10px] text-[#FF2D19] bg-[#FFF0ED] px-1 rounded">
                        {deal.discountText}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#888888]">{deal.salesText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
