import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useTaobaoStrings } from '../hooks/useTaobaoStrings';
import { useTaobaoGestures } from '../hooks/useTaobaoGestures';
import { useTaobaoStore } from '../state';
import { TAOBAO_ASSETS, getProductImage } from '../data';
import { IcNavBack, IcShare, IcStore, IcStar, IcTabCart } from '../res/icons';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const s = useTaobaoStrings();
  const { bindTap, bindBack } = useTaobaoGestures();
  const [justAdded, setJustAdded] = useState(false);

  const { products, favoriteIds, cartCount } = useTaobaoStore(
    useShallow((st) => ({
      products: st.products,
      favoriteIds: st.favoriteIds,
      cartCount: st.cart.reduce((acc, item) => acc + item.quantity, 0),
    })),
  );
  const toggleFavorite = useTaobaoStore((st) => st.toggleFavorite);
  const addToCart = useTaobaoStore((st) => st.addToCart);

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
          <IcNavBack size={22} className="text-[#11192D]" />
        </div>
        <span className="text-[16px] font-bold text-[#11192D]">{s.detail_title}</span>
        <div
          {...bindTap('product.cart.open')}
          className="relative w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-100 cursor-pointer"
        >
          <IcTabCart size={20} className="text-[#11192D]" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF5000] text-white text-[10px] font-bold flex items-center justify-center">
              {cartCount}
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
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-[#FF5000]">{s.currency_symbol}</span>
              <span className="text-2xl font-extrabold text-[#FF5000]">{product.priceText}</span>
              {product.originalPriceText && (
                <span className="text-xs text-[#7C889C] line-through ml-1">
                  {s.currency_symbol}
                  {product.originalPriceText}
                </span>
              )}
            </div>
            <span className="text-xs text-[#7C889C]">{product.salesText}</span>
          </div>

          <div className="text-[15px] font-bold text-[#11192D] leading-snug">
            {product.isTmall && (
              <img
                src={TAOBAO_ASSETS.badgeTmall}
                alt="Tmall"
                className="inline-block h-4 mr-1.5 align-text-bottom object-contain"
              />
            )}
            {product.title}
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-[#50607A]">
            <div>{s.detail_shipping}</div>
            <div className="flex items-center gap-1.5">
              <img
                src={TAOBAO_ASSETS.badgeReturn}
                alt={s.return_insurance}
                className="w-3.5 h-3.5 object-contain"
              />
              <span>{s.detail_guarantee}</span>
            </div>
          </div>
        </div>

        {/* Reviews Card */}
        <div className="bg-white p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#11192D]">{s.detail_reviews_title}</span>
            <span className="text-xs text-[#FF5000]">{product.reviewSummary}</span>
          </div>
          <div className="bg-[#F8F9FA] rounded-lg p-2.5 space-y-1">
            <div className="text-xs font-semibold text-[#11192D]">{product.reviewUser}</div>
            <p className="text-xs text-[#50607A] leading-relaxed">{product.reviewContent}</p>
          </div>
        </div>

        {/* Store Card */}
        <div className="bg-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#FFF0E8] flex items-center justify-center text-[#FF5000]">
              <IcStore size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#11192D]">{product.shopName}</div>
              <div className="text-[11px] text-[#FF5000]">天猫官方认证 · 综合体验 4.9</div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full border border-[#FF5000] text-[#FF5000] text-xs font-semibold">
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
              className={isFaved ? 'text-[#FF5000]' : 'text-[#50607A]'}
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
              { kind: 'action', id: 'product.cart.add' },
              {
                params: { productId: product.id },
                onTrigger: () => {
                  addToCart(product.id);
                  setJustAdded(true);
                },
              },
            )}
            className="flex-1 h-full bg-gradient-to-r from-[#FFC500] to-[#FF9402] text-white text-[13px] font-bold flex items-center justify-center cursor-pointer active:opacity-90"
          >
            {justAdded ? s.detail_added_cart : s.detail_add_cart}
          </div>
          <div
            {...bindTap('product.cart.open', {
              beforeTrigger: () => addToCart(product.id),
            })}
            className="flex-1 h-full bg-gradient-to-r from-[#FF7700] to-[#FF4900] text-white text-[13px] font-bold flex items-center justify-center cursor-pointer active:opacity-90"
          >
            {s.detail_buy_now}
          </div>
        </div>
      </div>
    </div>
  );
};
