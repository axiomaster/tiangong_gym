import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useMeituanStrings } from '../hooks/useMeituanStrings';
import { useMeituanGestures } from '../hooks/useMeituanGestures';
import { useMeituanStore } from '../state';
import { getDealImage } from '../data';
import { IcNavBack, IcShare, IcStore, IcStar, IcTabCart } from '../res/icons';

export const DealDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const s = useMeituanStrings();
  const { bindTap, bindBack } = useMeituanGestures();
  const [justAdded, setJustAdded] = useState(false);

  const { deals, favoriteIds, cartCount } = useMeituanStore(
    useShallow((st) => ({
      deals: st.deals,
      favoriteIds: st.favoriteIds,
      cartCount: st.cart.reduce((acc, item) => acc + item.quantity, 0),
    })),
  );
  const toggleFavorite = useMeituanStore((st) => st.toggleFavorite);
  const addToCart = useMeituanStore((st) => st.addToCart);

  const deal = deals.find((d) => d.id === id) || deals[0];
  const isFaved = favoriteIds.includes(deal.id);

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Bar */}
      <div className="bg-[#FFD100] px-3 py-2.5 flex items-center justify-between">
        <div
          {...bindBack()}
          className="w-8 h-8 rounded-full flex items-center justify-center active:bg-black/10 cursor-pointer"
        >
          <IcNavBack size={22} className="text-[#111111]" />
        </div>
        <span className="text-[16px] font-bold text-[#111111]">{s.detail_title}</span>
        <div
          {...bindTap('deal.cart.open')}
          className="relative w-8 h-8 rounded-full flex items-center justify-center active:bg-black/10 cursor-pointer"
        >
          <IcTabCart size={20} className="text-[#111111]" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF2D19] text-white text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      {/* Main Detail Scroll */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar pb-4 space-y-2.5"
        data-scroll-container="deal-detail"
        data-scroll-direction="vertical"
      >
        <div className="w-full aspect-[4/3] bg-white overflow-hidden">
          <img
            src={getDealImage(deal.imageKey)}
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Price & Title Card */}
        <div className="bg-white p-3.5 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-[#FF2D19]">{s.currency_symbol}</span>
              <span className="text-2xl font-extrabold text-[#FF2D19]">{deal.priceText}</span>
              {deal.priceSuffix && (
                <span className="text-xs text-[#FF2D19] font-semibold">{deal.priceSuffix}</span>
              )}
              {deal.originalPriceText && (
                <span className="text-xs text-[#888888] line-through ml-1">
                  {s.currency_symbol}
                  {deal.originalPriceText}
                </span>
              )}
              {deal.discountText && (
                <span className="text-[11px] text-[#FF2D19] bg-[#FFF0ED] px-1.5 py-0.5 rounded font-medium">
                  {deal.discountText}
                </span>
              )}
            </div>
            <span className="text-xs text-[#888888]">{deal.salesText}</span>
          </div>

          <div className="text-[15px] font-bold text-[#111111] leading-snug">{deal.title}</div>
          <div className="text-xs text-[#50607A]">{deal.subtitle}</div>

          <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-[#50607A]">
            <div>{s.detail_validity}</div>
            <div className="text-[#38B03F] font-medium">{s.detail_guarantee}</div>
          </div>
        </div>

        {/* Reviews Card */}
        <div className="bg-white p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#111111]">{s.detail_reviews_title}</span>
            <span className="text-xs text-[#FF6600] font-semibold">
              {deal.ratingText || '4.9分'} · {deal.reviewSummary}
            </span>
          </div>
          <div className="bg-[#F8F9FA] rounded-lg p-2.5 space-y-1">
            <div className="text-xs font-semibold text-[#111111]">{deal.reviewUser}</div>
            <p className="text-xs text-[#50607A] leading-relaxed">{deal.reviewContent}</p>
          </div>
        </div>

        {/* Merchant Card */}
        <div className="bg-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8D6] flex items-center justify-center text-[#111111]">
              <IcStore size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#111111]">{deal.shopName}</div>
              <div className="text-[11px] text-[#50607A]">
                {deal.badgeType} · 距离 {deal.locationOrDistance}
              </div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#FFD100] text-[#111111] text-xs font-bold">
            {s.detail_shop_enter}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-100 px-3 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 pl-1">
          <div className="flex flex-col items-center text-[#50607A]">
            <IcStore size={18} />
            <span className="text-[10px] mt-0.5">{s.detail_shop}</span>
          </div>
          <div
            {...bindTap(
              { kind: 'action', id: 'deal.favorite.toggle' },
              {
                params: { dealId: deal.id, to: !isFaved },
                onTrigger: () => toggleFavorite(deal.id),
              },
            )}
            className="flex flex-col items-center cursor-pointer"
          >
            <IcStar
              size={18}
              className={isFaved ? 'text-[#FFB800]' : 'text-[#50607A]'}
              fill={isFaved ? 'currentColor' : 'none'}
            />
            <span className="text-[10px] mt-0.5 text-[#50607A]">
              {isFaved ? s.detail_faved : s.detail_fav}
            </span>
          </div>
          <div className="flex flex-col items-center text-[#50607A]">
            <IcShare size={18} />
            <span className="text-[10px] mt-0.5">分享</span>
          </div>
        </div>

        <div className="flex-1 flex items-center rounded-full overflow-hidden h-10">
          <div
            {...bindTap(
              { kind: 'action', id: 'deal.cart.add' },
              {
                params: { dealId: deal.id },
                onTrigger: () => {
                  addToCart(deal.id);
                  setJustAdded(true);
                },
              },
            )}
            className="flex-1 h-full bg-[#FFF0B3] text-[#111111] text-[13px] font-bold flex items-center justify-center cursor-pointer active:opacity-90"
          >
            {justAdded ? s.detail_added_cart : s.detail_add_cart}
          </div>
          <div
            {...bindTap('deal.cart.open', {
              beforeTrigger: () => addToCart(deal.id),
            })}
            className="flex-1 h-full bg-[#FFD100] text-[#111111] text-[13px] font-bold flex items-center justify-center cursor-pointer active:opacity-90"
          >
            {s.detail_buy_now}
          </div>
        </div>
      </div>
    </div>
  );
};
