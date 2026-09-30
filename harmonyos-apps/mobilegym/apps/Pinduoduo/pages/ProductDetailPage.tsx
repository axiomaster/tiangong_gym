import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { usePinduoduoStrings } from '../hooks/usePinduoduoStrings';
import { usePinduoduoGestures } from '../hooks/usePinduoduoGestures';
import { usePinduoduoStore } from '../state';
import { getProductImage } from '../data';
import { IcNavBack, IcShare, IcStore, IcStar, IcTabMe } from '../res/icons';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const s = usePinduoduoStrings();
  const { bindTap, bindBack } = usePinduoduoGestures();
  const [justJoined, setJustJoined] = useState(false);

  const { products, favoriteIds, ordersCount } = usePinduoduoStore(
    useShallow((st) => ({
      products: st.products,
      favoriteIds: st.favoriteIds,
      ordersCount: st.orders.reduce((acc, item) => acc + item.quantity, 0),
    })),
  );
  const toggleFavorite = usePinduoduoStore((st) => st.toggleFavorite);
  const joinGroupBuy = usePinduoduoStore((st) => st.joinGroupBuy);

  const product = products.find((p) => p.id === id) || products[0];
  const isFaved = favoriteIds.includes(product.id);

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Bar */}
      <div className="bg-white px-3 py-2.5 flex items-center justify-between border-b border-gray-100">
        <div
          {...bindBack()}
          className="w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-100 cursor-pointer"
        >
          <IcNavBack size={22} className="text-[#151516]" />
        </div>
        <span className="text-[16px] font-bold text-[#151516]">{s.detail_title}</span>
        <div
          {...bindTap('product.me.open')}
          className="relative w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-100 cursor-pointer"
        >
          <IcTabMe size={20} className="text-[#151516]" />
          {ordersCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#E02E24] text-white text-[10px] font-bold flex items-center justify-center">
              {ordersCount}
            </span>
          )}
        </div>
      </div>

      {/* Main Detail Scroll */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar pb-4 space-y-2.5"
        data-scroll-container="product-detail"
        data-scroll-direction="vertical"
      >
        <div className="w-full aspect-square bg-white overflow-hidden">
          <img
            src={getProductImage(product.imageKey)}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Price & Title Card */}
        <div className="bg-white p-3.5 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              {product.pricePrefix && (
                <span className="text-xs font-bold text-[#E02E24]">{product.pricePrefix}</span>
              )}
              <span className="text-sm font-bold text-[#E02E24]">{s.currency_symbol}</span>
              <span className="text-2xl font-extrabold text-[#E02E24]">{product.priceText}</span>
              {product.originalPriceText && (
                <span className="text-xs text-[#9C9C9C] line-through ml-1">
                  {s.currency_symbol}
                  {product.originalPriceText}
                </span>
              )}
            </div>
            <span className="text-xs text-[#9C9C9C]">{product.salesText}</span>
          </div>

          {product.promoTag && (
            <div className="inline-block text-xs text-[#E02E24] bg-[#FFF0EE] px-2 py-0.5 rounded font-semibold">
              百亿补贴 · {product.promoTag}
            </div>
          )}

          <div className="text-[15px] font-bold text-[#151516] leading-snug">{product.title}</div>

          <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-[#58595B]">
            <div>{s.detail_shipping}</div>
            <div className="text-[#25B513] font-medium">{s.detail_guarantee}</div>
          </div>
        </div>

        {/* Reviews Card */}
        <div className="bg-white p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#151516]">{s.detail_reviews_title}</span>
            <span className="text-xs text-[#E02E24]">{product.reviewSummary}</span>
          </div>
          <div className="bg-[#F8F9FA] rounded-lg p-2.5 space-y-1">
            <div className="text-xs font-semibold text-[#151516]">{product.reviewUser}</div>
            <p className="text-xs text-[#58595B] leading-relaxed">{product.reviewContent}</p>
          </div>
        </div>

        {/* Store Card */}
        <div className="bg-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#FFF0EE] flex items-center justify-center text-[#E02E24]">
              <IcStore size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#151516]">{product.shopName}</div>
              <div className="text-[11px] text-[#E02E24]">拼多多百亿补贴认证 · 全场包邮</div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full border border-[#E02E24] text-[#E02E24] text-xs font-semibold">
            {s.detail_shop_enter}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-100 px-3 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 pl-1">
          <div className="flex flex-col items-center text-[#58595B]">
            <IcStore size={18} />
            <span className="text-[10px] mt-0.5">{s.detail_shop}</span>
          </div>
          <div
            {...bindTap(
              { kind: 'action', id: 'product.favorite.toggle' },
              {
                params: { productId: product.id, to: !isFaved },
                onTrigger: () => toggleFavorite(product.id),
              },
            )}
            className="flex flex-col items-center cursor-pointer"
          >
            <IcStar
              size={18}
              className={isFaved ? 'text-[#E02E24]' : 'text-[#58595B]'}
              fill={isFaved ? 'currentColor' : 'none'}
            />
            <span className="text-[10px] mt-0.5 text-[#58595B]">
              {isFaved ? s.detail_faved : s.detail_fav}
            </span>
          </div>
          <div className="flex flex-col items-center text-[#58595B]">
            <IcShare size={18} />
            <span className="text-[10px] mt-0.5">{s.detail_share}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center rounded-lg overflow-hidden h-10">
          <div
            {...bindTap('product.me.open', {
              beforeTrigger: () => joinGroupBuy(product.id),
            })}
            className="flex-1 h-full bg-[#F3ABA7] text-white text-[12px] font-bold flex flex-col items-center justify-center cursor-pointer active:opacity-90 leading-tight"
          >
            <span>
              {s.currency_symbol}
              {product.originalPriceText || product.priceText}
            </span>
            <span>{s.detail_buy_alone}</span>
          </div>
          <div
            {...bindTap(
              { kind: 'action', id: 'product.groupbuy.join' },
              {
                params: { productId: product.id },
                onTrigger: () => {
                  joinGroupBuy(product.id);
                  setJustJoined(true);
                },
              },
            )}
            className="flex-1 h-full bg-[#E02E24] text-white text-[12px] font-bold flex flex-col items-center justify-center cursor-pointer active:opacity-90 leading-tight"
          >
            <span>
              {s.currency_symbol}
              {product.priceText}
            </span>
            <span>{justJoined ? s.detail_group_joined : s.detail_group_buy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
