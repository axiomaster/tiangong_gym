import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { usePinduoduoStrings } from '../hooks/usePinduoduoStrings';
import { usePinduoduoGestures } from '../hooks/usePinduoduoGestures';
import { usePinduoduoStore } from '../state';
import { PINDUODUO_ASSETS, getProductImage } from '../data';
import { IcSparkles } from '../res/icons';

export const HomePage: React.FC = () => {
  const s = usePinduoduoStrings();
  const { bindTap } = usePinduoduoGestures();
  const [searchParams] = useSearchParams();
  const activeChannel = searchParams.get('channel') || 'recommend';

  const { products, pxqViewed } = usePinduoduoStore(
    useShallow((st) => ({
      products: st.products,
      pxqViewed: st.pxqViewed,
    })),
  );
  const viewPxqUpdates = usePinduoduoStore((st) => st.viewPxqUpdates);

  const channels = [
    { id: 'recommend', label: s.ch_recommend },
    { id: 'phone', label: s.ch_phone },
    { id: 'food', label: s.ch_food },
    { id: 'medical', label: s.ch_medical },
    { id: 'women', label: s.ch_women },
    { id: 'department', label: s.ch_department },
    { id: 'shoes_bags', label: s.ch_shoes_bags },
  ];

  const kingkongItems = [
    { id: 'seckill', label: s.kk_seckill, icon: PINDUODUO_ASSETS.kkSeckill, channel: 'recommend' },
    { id: 'topup', label: s.kk_topup, icon: PINDUODUO_ASSETS.kkTopup, channel: 'phone' },
    { id: 'wheel', label: s.kk_wheel, icon: PINDUODUO_ASSETS.kkWheel, channel: 'recommend' },
    { id: 'fruit', label: s.kk_fruit, icon: PINDUODUO_ASSETS.kkFruit, channel: 'food' },
    { id: 'other', label: s.kk_other, icon: null, channel: 'department' },
  ];

  const ddmcItems = [
    { id: 'ddmc_1', img: PINDUODUO_ASSETS.ddmcItem1, price: '1.99', productId: 'prod_ddmc_199' },
    { id: 'ddmc_2', img: PINDUODUO_ASSETS.ddmcItem2, price: '19.49', productId: 'prod_ddmc_199' },
    { id: 'ddmc_3', img: PINDUODUO_ASSETS.ddmcItem3, price: '6.99', productId: 'prod_ddmc_199' },
    { id: 'ddmc_4', img: PINDUODUO_ASSETS.ddmcItem4, price: '89.9', productId: 'prod_ddmc_199' },
  ];

  const subsidyItems = [
    {
      id: 'sub_1',
      img: PINDUODUO_ASSETS.prodIqoo15t,
      price: '3729',
      badge: null,
      productId: 'prod_iqoo15t',
    },
    {
      id: 'sub_2',
      img: PINDUODUO_ASSETS.subsidyItem1,
      price: '4099',
      badge: null,
      productId: 'prod_subsidy_4099',
    },
    {
      id: 'sub_3',
      img: PINDUODUO_ASSETS.subsidyItem2,
      price: '3039',
      badge: s.subsidy_coupon_150,
      productId: 'prod_subsidy_3039',
    },
    {
      id: 'sub_4',
      img: PINDUODUO_ASSETS.subsidyItem3,
      price: '1549',
      badge: null,
      productId: 'prod_subsidy_1549',
    },
  ];

  const displayedProducts =
    activeChannel === 'recommend'
      ? products
      : products.filter((p) => p.category === activeChannel || p.category === 'recommend');

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Search Bar */}
      <div className="px-3 pt-1 pb-1.5 bg-white">
        <div
          {...bindTap('home.search.open')}
          className="flex items-center h-[36px] rounded-[8px] bg-[#EDEDED] px-3 cursor-pointer active:opacity-90"
        >
          <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0">
            <img
              src={PINDUODUO_ASSETS.searchIcon}
              alt="search"
              className="w-4 h-4 object-contain flex-shrink-0"
            />
            <span className="text-[14px] text-[#58595B] truncate">{s.search_placeholder}</span>
          </div>
          <img
            src={PINDUODUO_ASSETS.searchCamera}
            alt="camera"
            className="w-5 h-5 object-contain flex-shrink-0"
          />
        </div>
      </div>

      {/* Horizontal Channel Tabs */}
      <div
        className="flex items-center gap-5 px-3.5 py-2 bg-white border-b border-gray-100 overflow-x-auto no-scrollbar"
        data-scroll-container="home-channels"
        data-scroll-direction="horizontal"
      >
        {channels.map((ch) => {
          const isActive = activeChannel === ch.id;
          return (
            <div
              key={ch.id}
              {...bindTap('home.channel.switch', { params: { channel: ch.id } })}
              className={`relative flex-shrink-0 cursor-pointer transition-colors ${
                isActive
                  ? 'text-[16px] font-bold text-[#E02E24]'
                  : 'text-[15px] font-medium text-[#151516]'
              }`}
            >
              <span>{ch.label}</span>
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-[2.5px] rounded-full bg-[#E02E24]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Scrollable Feed */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar pb-4 space-y-2"
        data-scroll-container="home-feed"
        data-scroll-direction="vertical"
      >
        {/* 拼小圈 Bar */}
        <div
          {...bindTap(
            { kind: 'action', id: 'home.pxq.view' },
            { onTrigger: () => viewPxqUpdates() },
          )}
          className="bg-white px-3.5 py-2.5 flex items-center justify-between cursor-pointer active:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-[#151516]">{s.pxq_title}</span>
            {!pxqViewed && (
              <span className="w-2 h-2 rounded-full bg-[#E02E24]" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <img
              src={PINDUODUO_ASSETS.pxqAvatar}
              alt="pxq"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-[13px] text-[#58595B]">
              {pxqViewed ? s.pxq_viewed_subtitle : s.pxq_subtitle}
            </span>
            <img
              src={PINDUODUO_ASSETS.pxqArrow}
              alt="arrow"
              className="w-3 h-3 object-contain"
            />
          </div>
        </div>

        {/* 5-Column Kingkong Row */}
        <div className="bg-white py-3 px-2 grid grid-cols-5 gap-1">
          {kingkongItems.map((item) => (
            <div
              key={item.id}
              {...bindTap('home.channel.switch', { params: { channel: item.channel } })}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              {item.icon ? (
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-11 h-11 object-contain"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0EE] flex items-center justify-center text-[#E02E24]">
                  <IcSparkles size={22} />
                </div>
              )}
              <span className="text-[12px] text-[#151516] font-medium mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* 多多买菜 & 百亿补贴 Rows */}
        <div className="bg-white mx-2 rounded-[10px] p-2.5 space-y-3">
          {/* 多多买菜 Row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-extrabold text-[#151516]">{s.ddmc_title}</span>
                <span className="text-[11px] text-[#25B513] bg-[#E8F8E6] px-1.5 py-0.5 rounded font-medium">
                  次日自提
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ddmcItems.map((item) => (
                <div
                  key={item.id}
                  {...bindTap('home.product.open', { params: { id: item.productId } })}
                  className="flex flex-col items-center cursor-pointer active:opacity-90"
                >
                  <div className="w-full aspect-square rounded-lg bg-[#F9F9F9] overflow-hidden p-1">
                    <img
                      src={item.img}
                      alt={s.ddmc_title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mt-1 flex items-baseline text-[#E02E24] font-bold">
                    <span className="text-[10px]">{s.currency_symbol}</span>
                    <span className="text-[13px]">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* 百亿补贴 Row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-extrabold text-[#151516]">
                  {s.subsidy_title}
                </span>
                <span className="text-[11px] text-[#E02E24] bg-[#FFEAE8] px-1.5 py-0.5 rounded font-medium">
                  官方正品
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {subsidyItems.map((item) => (
                <div
                  key={item.id}
                  {...bindTap('home.product.open', { params: { id: item.productId } })}
                  className="flex flex-col items-center cursor-pointer active:opacity-90"
                >
                  <div className="relative w-full aspect-square rounded-lg bg-[#F9F9F9] overflow-hidden p-1">
                    <img
                      src={item.img}
                      alt={s.subsidy_title}
                      className="w-full h-full object-contain"
                    />
                    {item.badge && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 bg-[#E02E24] text-white text-[9px] font-bold px-1 rounded whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-baseline text-[#E02E24] font-bold">
                    <span className="text-[10px]">{s.currency_symbol}</span>
                    <span className="text-[13px]">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Product Feed */}
        <div className="px-2 grid grid-cols-2 gap-2">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              {...bindTap('home.product.open', { params: { id: product.id } })}
              className="bg-white rounded-[10px] overflow-hidden flex flex-col cursor-pointer active:opacity-95 transition-opacity shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
            >
              <div className="w-full aspect-square bg-[#F8F9FA] overflow-hidden">
                <img
                  src={getProductImage(product.imageKey)}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[13px] text-[#151516] font-medium leading-[1.35] line-clamp-2">
                    {product.title}
                  </div>
                  {product.promoTag && (
                    <div className="mt-1 inline-block text-[10px] text-[#E02E24] border border-[#E02E24]/40 bg-[#FFF3F2] px-1.5 py-0.2 rounded">
                      {product.promoTag}
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-baseline justify-between gap-1">
                  <div className="flex items-baseline min-w-0">
                    {product.pricePrefix && (
                      <span className="text-[10px] text-[#E02E24] font-semibold mr-0.5 whitespace-nowrap">
                        {product.pricePrefix}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-[#E02E24]">
                      {s.currency_symbol}
                    </span>
                    <span className="text-[16px] font-extrabold text-[#E02E24] leading-none">
                      {product.priceText}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9C9C9C] truncate">{product.salesText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
