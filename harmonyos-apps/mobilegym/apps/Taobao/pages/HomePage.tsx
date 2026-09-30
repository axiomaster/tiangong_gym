import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useTaobaoStrings } from '../hooks/useTaobaoStrings';
import { useTaobaoGestures } from '../hooks/useTaobaoGestures';
import { useTaobaoStore } from '../state';
import { TAOBAO_ASSETS, getProductImage } from '../data';

export const HomePage: React.FC = () => {
  const s = useTaobaoStrings();
  const { bindTap } = useTaobaoGestures();
  const [searchParams] = useSearchParams();
  const activeChannel = searchParams.get('channel') || 'recommend';

  const { products, promoCouponClaimed } = useTaobaoStore(
    useShallow((st) => ({
      products: st.products,
      promoCouponClaimed: st.promoCouponClaimed,
    })),
  );
  const claimPromoCoupon = useTaobaoStore((st) => st.claimPromoCoupon);

  const channels = [
    { id: 'follow', label: s.ch_follow },
    { id: 'recommend', label: s.ch_recommend },
    { id: 'flash', label: s.ch_flash },
    { id: 'subsidy', label: s.ch_subsidy },
    { id: 'fliggy', label: s.ch_fliggy },
    { id: 'national', label: s.ch_national },
    { id: 'outfit', label: s.ch_outfit },
  ];

  const kingkongItems = [
    { id: 'tmall_new', label: s.kk_tmall_new, icon: TAOBAO_ASSETS.kkTmallNew, channel: 'recommend' },
    { id: 'daily_cash', label: s.kk_daily_cash, icon: TAOBAO_ASSETS.kkDailyCash, channel: 'flash' },
    { id: 'baba_farm', label: s.kk_baba_farm, icon: TAOBAO_ASSETS.kkBabaFarm, channel: 'recommend' },
    { id: 'topup', label: s.kk_topup, icon: TAOBAO_ASSETS.kkTopup, channel: 'subsidy' },
    { id: '88vip', label: s.kk_88vip, icon: TAOBAO_ASSETS.kk88Vip, channel: 'national' },
    { id: 'taocoins', label: s.kk_taocoins, icon: TAOBAO_ASSETS.kkTaoCoins, channel: 'outfit' },
  ];

  const displayedProducts =
    activeChannel === 'recommend' || activeChannel === 'follow' || activeChannel === 'national'
      ? products
      : products.filter((p) => p.category === activeChannel || p.category === 'recommend');

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Channel Bar */}
      <div
        className="flex items-center gap-4 px-3 pt-1 pb-2 bg-white overflow-x-auto no-scrollbar"
        data-scroll-container="home-channels"
        data-scroll-direction="horizontal"
      >
        {channels.map((ch) => {
          const isActive = activeChannel === ch.id;
          const isNational = ch.id === 'national';
          return (
            <div
              key={ch.id}
              {...bindTap('home.channel.switch', { params: { channel: ch.id } })}
              className={`relative flex-shrink-0 cursor-pointer transition-colors ${
                isActive
                  ? 'text-[17px] font-bold text-[#11192D]'
                  : isNational
                    ? 'text-[15px] font-semibold text-[#FF5000]'
                    : 'text-[15px] font-medium text-[#11192D]'
              }`}
            >
              <span>{ch.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-[#FF5000]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="px-2.5 pb-2 bg-white">
        <div
          {...bindTap('home.search.open')}
          className="flex items-center h-[38px] rounded-[10px] border-[1.8px] border-[#FF5000] bg-white pl-2.5 pr-1 cursor-pointer active:opacity-90"
        >
          <img
            src={TAOBAO_ASSETS.searchScan}
            alt="scan"
            className="w-6 h-6 object-contain flex-shrink-0"
          />
          <span className="flex-1 ml-2 text-[14px] font-medium text-[#11192D] truncate">
            {s.search_placeholder}
          </span>
          <img
            src={TAOBAO_ASSETS.searchCamera}
            alt="camera"
            className="w-6 h-6 object-contain mr-2 flex-shrink-0"
          />
          <div className="h-[30px] px-3.5 rounded-[7px] bg-gradient-to-r from-[#FF7700] to-[#FF5000] flex items-center justify-center text-white text-[14px] font-semibold flex-shrink-0">
            {s.search_btn}
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar px-2 pb-4 space-y-2"
        data-scroll-container="home-feed"
        data-scroll-direction="vertical"
      >
        {/* 6-Column Kingkong Row */}
        <div className="bg-white rounded-[12px] py-2.5 px-1.5 grid grid-cols-6 gap-1">
          {kingkongItems.map((item) => (
            <div
              key={item.id}
              {...bindTap('home.channel.switch', { params: { channel: item.channel } })}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-[54px] h-[44px] object-contain"
              />
              <span className="text-[11px] text-[#11192D] font-medium mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* 3-Column Feature Cards: 淘宝直播 / 百亿补贴 / 淘宝秒杀 */}
        <div className="grid grid-cols-3 gap-1.5">
          {/* 淘宝直播 */}
          <div
            {...bindTap('home.product.open', { params: { id: 'prod_anta_3' } })}
            className="bg-white rounded-[12px] p-2 flex flex-col cursor-pointer active:opacity-90"
          >
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-bold text-[#11192D] whitespace-nowrap">
                {s.card_live_title}
              </span>
              <img src={TAOBAO_ASSETS.liveBadge} alt="live" className="w-3.5 h-3.5 object-contain" />
            </div>
            <span className="text-[10px] text-[#FF2253] font-medium mb-1">{s.card_live_sub}</span>
            <div className="relative rounded-[8px] overflow-hidden aspect-square bg-[#FFF5F5]">
              <img
                src={TAOBAO_ASSETS.cardLive}
                alt={s.card_live_title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/45 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] text-white whitespace-nowrap">
                {s.card_live_sub}
              </div>
            </div>
          </div>

          {/* 百亿补贴 */}
          <div
            {...bindTap('home.product.open', { params: { id: 'prod_subsidy_item' } })}
            className="bg-white rounded-[12px] p-2 flex flex-col cursor-pointer active:opacity-90"
          >
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-bold text-[#11192D] whitespace-nowrap">
                {s.card_subsidy_title}
              </span>
            </div>
            <span className="text-[10px] text-[#FF471A] font-medium mb-1">
              {s.card_subsidy_sub}
            </span>
            <div className="rounded-[8px] overflow-hidden aspect-square bg-[#F9FAFB] flex items-center justify-center p-1">
              <img
                src={TAOBAO_ASSETS.cardSubsidy}
                alt={s.card_subsidy_title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-1 flex items-baseline justify-center text-[#FF5000] font-bold">
              <span className="text-[10px]">{s.currency_symbol}</span>
              <span className="text-[13px]">1589</span>
            </div>
          </div>

          {/* 淘宝秒杀 */}
          <div
            {...bindTap('home.product.open', { params: { id: 'prod_seckill_item' } })}
            className="bg-white rounded-[12px] p-2 flex flex-col cursor-pointer active:opacity-90"
          >
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-bold text-[#11192D] whitespace-nowrap">
                {s.card_seckill_title}
              </span>
            </div>
            <span className="text-[10px] text-[#FF0338] font-medium mb-1">
              {s.card_seckill_sub}
            </span>
            <div className="rounded-[8px] overflow-hidden aspect-square bg-[#F9FAFB] flex items-center justify-center p-1">
              <img
                src={TAOBAO_ASSETS.cardSeckill}
                alt={s.card_seckill_title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-1 flex items-baseline justify-center text-[#FF5000] font-bold">
              <span className="text-[10px]">{s.currency_symbol}</span>
              <span className="text-[13px]">5.1</span>
            </div>
          </div>
        </div>

        {/* National Day Promo Banner (国庆狂欢 送你255元消费券包) */}
        <div
          {...bindTap(
            { kind: 'action', id: 'home.promo.claim' },
            { onTrigger: () => claimPromoCoupon() },
          )}
          className="rounded-[12px] bg-[#FFEAE3] px-3 py-2 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={TAOBAO_ASSETS.promoIcon}
              alt="promo"
              className="w-5 h-5 object-contain flex-shrink-0"
            />
            <img
              src={TAOBAO_ASSETS.promoTitle}
              alt={s.ch_national}
              className="h-4 object-contain flex-shrink-0"
            />
            <span className="text-[13px] font-semibold text-[#FF173E] truncate ml-1">
              {promoCouponClaimed ? s.promo_banner_claimed : s.promo_banner_text}
            </span>
          </div>
          <div className="relative flex items-center flex-shrink-0">
            <img
              src={TAOBAO_ASSETS.promoBtn}
              alt={s.promo_claim_btn}
              className="h-8 object-contain"
            />
            {promoCouponClaimed && (
              <span className="absolute right-2 text-[10px] font-bold text-white bg-[#FF173E]/90 px-1.5 py-0.5 rounded">
                {s.promo_claimed_btn}
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Waterfall Product Feed */}
        <div className="grid grid-cols-2 gap-2">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              {...bindTap('home.product.open', { params: { id: product.id } })}
              className="bg-white rounded-[12px] overflow-hidden flex flex-col cursor-pointer active:opacity-95 transition-opacity shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
            >
              <div className="w-full aspect-[3/4] bg-[#F8F9FA] overflow-hidden">
                <img
                  src={getProductImage(product.imageKey)}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[13px] text-[#11192D] font-medium leading-[1.35] line-clamp-2">
                    {product.isTmall && (
                      <img
                        src={TAOBAO_ASSETS.badgeTmall}
                        alt="Tmall"
                        className="inline-block h-[14px] mr-1 align-text-bottom object-contain"
                      />
                    )}
                    {product.title}
                  </div>
                  {product.hasReturnInsurance && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <img
                        src={TAOBAO_ASSETS.badgeReturn}
                        alt={s.return_insurance}
                        className="w-3 h-3 object-contain"
                      />
                      <span className="text-[11px] text-[#50607A]">{s.return_insurance}</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[11px] font-bold text-[#FF5000]">
                      {s.currency_symbol}
                    </span>
                    <span className="text-[17px] font-bold text-[#FF5000] leading-none">
                      {product.priceText}
                    </span>
                    <span className="text-[11px] text-[#7C889C] ml-1">{product.salesText}</span>
                  </div>
                  <span className="text-[#7C889C] text-xs font-bold">···</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
