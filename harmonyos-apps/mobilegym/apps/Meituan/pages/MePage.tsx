import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMeituanStrings } from '../hooks/useMeituanStrings';
import { useMeituanGestures } from '../hooks/useMeituanGestures';
import { useMeituanStore } from '../state';
import { MEITUAN_ASSETS, getDealImage } from '../data';
import {
  IcSettings,
  IcCreditCard,
  IcPackage,
  IcStar,
  IcRefund,
  IcNavForward,
} from '../res/icons';

export const MePage: React.FC = () => {
  const s = useMeituanStrings();
  const { bindTap } = useMeituanGestures();
  const { user, favoriteIds, deals } = useMeituanStore(
    useShallow((st) => ({
      user: st.user,
      favoriteIds: st.favoriteIds,
      deals: st.deals,
    })),
  );

  const favDeals = deals.filter((d) => favoriteIds.includes(d.id));

  const orderActions = [
    { id: 'unpaid', label: s.me_order_unpaid, icon: IcCreditCard },
    { id: 'unused', label: s.me_order_unused, icon: IcPackage },
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
            <div className="w-14 h-14 rounded-full bg-[#FFD100] p-1 shadow-xs overflow-hidden flex items-center justify-center">
              <img
                src={MEITUAN_ASSETS.kkWaimai}
                alt={user.nickname}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-[17px] font-bold text-[#111111]">{user.nickname}</div>
              <div className="text-xs text-[#888888] mt-0.5">美团号: {user.mtAccount}</div>
            </div>
          </div>
          <div className="p-2 text-[#50607A]">
            <IcSettings size={20} />
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white rounded-xl py-3 px-2 grid grid-cols-4 text-center">
          <div>
            <div className="text-[16px] font-bold text-[#111111]">{favoriteIds.length}</div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_stat_fav}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#111111]">{user.followedShopsCount}</div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_stat_follow_shop}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#111111]">{user.footprintsCount}</div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_stat_footprint}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#FF2D19]">{user.couponsCount}</div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_stat_coupons}</div>
          </div>
        </div>

        {/* Shen Hui Yuan Banner */}
        <div className="rounded-xl bg-gradient-to-r from-[#2B251B] to-[#4A3B22] p-3.5 text-[#FFE799] flex items-center justify-between">
          <div>
            <div className="text-sm font-bold">{s.me_vip_title}</div>
            <div className="text-[11px] text-[#FFE799]/80 mt-0.5">{s.me_vip_sub}</div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#FFD100] text-[#111111] text-xs font-bold">
            立即膨胀
          </span>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-[#111111]">{s.me_orders_title}</span>
            <div className="flex items-center text-xs text-[#888888]">
              <span>{s.me_orders_all}</span>
              <IcNavForward size={14} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 pt-1">
            {orderActions.map((act) => (
              <div key={act.id} className="flex flex-col items-center gap-1.5">
                <act.icon size={22} className="text-[#111111]" strokeWidth={1.8} />
                <span className="text-[11px] text-[#50607A]">{act.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Favorites Preview */}
        {favDeals.length > 0 && (
          <div className="bg-white rounded-xl p-3.5 space-y-2.5">
            <div className="text-[15px] font-bold text-[#111111]">{s.me_stat_fav}</div>
            <div className="grid grid-cols-2 gap-2">
              {favDeals.map((deal) => (
                <div
                  key={deal.id}
                  {...bindTap('home.deal.open', { params: { id: deal.id } })}
                  className="border border-gray-100 rounded-lg p-2 flex items-center gap-2 cursor-pointer active:bg-gray-50"
                >
                  <img
                    src={getDealImage(deal.imageKey)}
                    alt={deal.title}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#111111] truncate">
                      {deal.shortTitle}
                    </div>
                    <div className="text-xs font-bold text-[#FF2D19] mt-1">
                      {s.currency_symbol}
                      {deal.priceText}
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
