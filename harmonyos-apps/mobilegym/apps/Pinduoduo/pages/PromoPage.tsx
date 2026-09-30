import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePinduoduoStrings } from '../hooks/usePinduoduoStrings';
import { usePinduoduoGestures } from '../hooks/usePinduoduoGestures';
import { usePinduoduoStore } from '../state';
import { getProductImage } from '../data';
import { IcFlame } from '../res/icons';

export const PromoPage: React.FC = () => {
  const s = usePinduoduoStrings();
  const { bindTap } = usePinduoduoGestures();
  const { products, promoCouponClaimed } = usePinduoduoStore(
    useShallow((st) => ({
      products: st.products,
      promoCouponClaimed: st.promoCouponClaimed,
    })),
  );
  const claimPromoCoupon = usePinduoduoStore((st) => st.claimPromoCoupon);

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="light"
      data-navigation-bar-foreground="dark"
    >
      {/* Promo Hero Header */}
      <div className="bg-gradient-to-r from-[#E02E24] to-[#FF5338] px-4 py-4 text-white">
        <div className="flex items-center gap-1.5">
          <IcFlame size={20} className="text-[#FFE4A0]" />
          <span className="text-[18px] font-extrabold">{s.promo_page_title}</span>
        </div>
        <p className="text-xs text-white/90 mt-1">{s.promo_page_sub}</p>

        <div className="mt-3 bg-white/95 rounded-xl p-3 flex items-center justify-between text-[#151516]">
          <div>
            <div className="text-xs text-[#E02E24] font-bold">百亿补贴 · 国庆大促神券</div>
            <div className="text-lg font-extrabold text-[#E02E24]">满3000减150元</div>
          </div>
          <div
            {...bindTap(
              { kind: 'action', id: 'promo.coupon.claim' },
              { onTrigger: () => claimPromoCoupon() },
            )}
            className={`px-3.5 py-2 rounded-full text-xs font-bold cursor-pointer active:scale-95 transition-transform ${
              promoCouponClaimed
                ? 'bg-gray-200 text-[#58595B]'
                : 'bg-[#E02E24] text-white'
            }`}
          >
            {promoCouponClaimed ? s.promo_claimed_btn : s.promo_claim_btn}
          </div>
        </div>
      </div>

      {/* Promo Product List */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-2.5"
        data-scroll-container="promo-list"
        data-scroll-direction="vertical"
      >
        {products.map((prod) => (
          <div
            key={prod.id}
            {...bindTap('home.product.open', { params: { id: prod.id } })}
            className="bg-white rounded-xl p-3 flex items-center gap-3 cursor-pointer active:bg-gray-50"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
              <img
                src={getProductImage(prod.imageKey)}
                alt={prod.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
              <div>
                <div className="text-[13px] font-semibold text-[#151516] line-clamp-2">
                  {prod.title}
                </div>
                {prod.promoTag && (
                  <span className="inline-block mt-1 text-[10px] text-[#E02E24] bg-[#FFF0EE] px-1.5 py-0.5 rounded">
                    {prod.promoTag}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-0.5 text-[#E02E24] font-bold">
                  {prod.pricePrefix && (
                    <span className="text-[10px] mr-0.5">{prod.pricePrefix}</span>
                  )}
                  <span className="text-xs">{s.currency_symbol}</span>
                  <span className="text-[18px]">{prod.priceText}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E02E24] text-white text-xs font-bold">
                  抢购
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
