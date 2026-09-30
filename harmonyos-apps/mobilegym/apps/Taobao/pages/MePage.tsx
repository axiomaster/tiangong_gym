import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTaobaoStrings } from '../hooks/useTaobaoStrings';
import { useTaobaoGestures } from '../hooks/useTaobaoGestures';
import { useTaobaoStore } from '../state';
import { TAOBAO_ASSETS, getProductImage } from '../data';
import {
  IcSettings,
  IcCreditCard,
  IcPackage,
  IcTruck,
  IcStar,
  IcRefund,
  IcNavForward,
} from '../res/icons';

export const MePage: React.FC = () => {
  const s = useTaobaoStrings();
  const { bindTap } = useTaobaoGestures();
  const { user, favoriteIds, products } = useTaobaoStore(
    useShallow((st) => ({
      user: st.user,
      favoriteIds: st.favoriteIds,
      products: st.products,
    })),
  );

  const favProducts = products.filter((p) => favoriteIds.includes(p.id));

  const orderActions = [
    { id: 'unpaid', label: s.me_order_unpaid, icon: IcCreditCard },
    { id: 'unshipped', label: s.me_order_unshipped, icon: IcPackage },
    { id: 'shipped', label: s.me_order_shipped, icon: IcTruck },
    { id: 'review', label: s.me_order_review, icon: IcStar },
    { id: 'refund', label: s.me_order_refund, icon: IcRefund },
  ];

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3"
        data-scroll-container="me-main"
        data-scroll-direction="vertical"
      >
        {/* User Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-xs overflow-hidden">
              <img
                src={TAOBAO_ASSETS.tabHomeActive}
                alt={user.nickname}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-[17px] font-bold text-[#11192D]">{user.nickname}</div>
              <div className="text-xs text-[#7C889C] mt-0.5">账号: {user.tbAccount}</div>
            </div>
          </div>
          <div className="p-2 text-[#50607A]">
            <IcSettings size={20} />
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white rounded-xl py-3 px-2 grid grid-cols-4 text-center">
          <div>
            <div className="text-[16px] font-bold text-[#11192D]">{favoriteIds.length}</div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_stat_fav}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#11192D]">{user.followedShopsCount}</div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_stat_follow_shop}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#11192D]">{user.footprintsCount}</div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_stat_footprint}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#FF5000]">{user.couponsCount}</div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_stat_coupons}</div>
          </div>
        </div>

        {/* 88VIP Banner */}
        <div className="rounded-xl bg-gradient-to-r from-[#2D2520] to-[#47382F] p-3.5 text-[#F7DEC0] flex items-center justify-between">
          <div>
            <div className="text-sm font-bold">{s.me_vip_title}</div>
            <div className="text-[11px] text-[#F7DEC0]/80 mt-0.5">{s.me_vip_sub}</div>
          </div>
          <img src={TAOBAO_ASSETS.kk88Vip} alt="88VIP" className="w-11 h-11 object-contain" />
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-[#11192D]">{s.me_orders_title}</span>
            <div className="flex items-center text-xs text-[#7C889C]">
              <span>{s.me_orders_all}</span>
              <IcNavForward size={14} />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1 pt-1">
            {orderActions.map((act) => (
              <div key={act.id} className="flex flex-col items-center gap-1.5">
                <act.icon size={22} className="text-[#11192D]" strokeWidth={1.8} />
                <span className="text-[11px] text-[#50607A]">{act.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Favorites Preview */}
        {favProducts.length > 0 && (
          <div className="bg-white rounded-xl p-3.5 space-y-2.5">
            <div className="text-[15px] font-bold text-[#11192D]">{s.me_stat_fav}</div>
            <div className="grid grid-cols-2 gap-2">
              {favProducts.map((prod) => (
                <div
                  key={prod.id}
                  {...bindTap('home.product.open', { params: { id: prod.id } })}
                  className="border border-gray-100 rounded-lg p-2 flex items-center gap-2 cursor-pointer active:bg-gray-50"
                >
                  <img
                    src={getProductImage(prod.imageKey)}
                    alt={prod.title}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#11192D] truncate">{prod.title}</div>
                    <div className="text-xs font-bold text-[#FF5000] mt-1">
                      {s.currency_symbol}
                      {prod.priceText}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
