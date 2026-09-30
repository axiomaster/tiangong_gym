import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePinduoduoStrings } from '../hooks/usePinduoduoStrings';
import { usePinduoduoGestures } from '../hooks/usePinduoduoGestures';
import { usePinduoduoStore } from '../state';
import { PINDUODUO_ASSETS, getProductImage } from '../data';
import {
  IcSettings,
  IcCreditCard,
  IcUsers,
  IcPackage,
  IcTruck,
  IcStar,
  IcNavForward,
} from '../res/icons';

export const MePage: React.FC = () => {
  const s = usePinduoduoStrings();
  const { bindTap } = usePinduoduoGestures();
  const { user, favoriteIds, orders, products } = usePinduoduoStore(
    useShallow((st) => ({
      user: st.user,
      favoriteIds: st.favoriteIds,
      orders: st.orders,
      products: st.products,
    })),
  );

  const favProducts = products.filter((p) => favoriteIds.includes(p.id));

  const orderActions = [
    { id: 'unpaid', label: s.me_order_unpaid, icon: IcCreditCard },
    { id: 'grouping', label: s.me_order_grouping, icon: IcUsers },
    { id: 'unshipped', label: s.me_order_unshipped, icon: IcPackage },
    { id: 'shipped', label: s.me_order_shipped, icon: IcTruck },
    { id: 'review', label: s.me_order_review, icon: IcStar },
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
            <div className="w-14 h-14 rounded-full bg-white p-0.5 shadow-xs overflow-hidden">
              <img
                src={PINDUODUO_ASSETS.pxqAvatar}
                alt={user.nickname}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="text-[17px] font-bold text-[#151516]">{user.nickname}</div>
              <div className="text-xs text-[#9C9C9C] mt-0.5">ID: {user.pddId}</div>
            </div>
          </div>
          <div className="p-2 text-[#58595B]">
            <IcSettings size={20} />
          </div>
        </div>

        {/* Monthly Saver Banner */}
        <div className="rounded-xl bg-gradient-to-r from-[#FFEAE8] to-[#FFD8D4] p-3.5 text-[#E02E24] flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold">{s.me_vip_title}</div>
            <div className="text-[11px] text-[#E02E24]/80 mt-0.5">{s.me_vip_sub}</div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#E02E24] text-white text-xs font-bold">
            已开通
          </span>
        </div>

        {/* User Stats */}
        <div className="bg-white rounded-xl py-3 px-2 grid grid-cols-4 text-center">
          <div>
            <div className="text-[16px] font-bold text-[#E02E24]">{user.couponsCount}</div>
            <div className="text-[11px] text-[#58595B] mt-0.5">{s.me_stat_coupons}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#151516]">{favoriteIds.length}</div>
            <div className="text-[11px] text-[#58595B] mt-0.5">{s.me_stat_fav}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#151516]">{user.followedShopsCount}</div>
            <div className="text-[11px] text-[#58595B] mt-0.5">{s.me_stat_follow_shop}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#151516]">{user.footprintsCount}</div>
            <div className="text-[11px] text-[#58595B] mt-0.5">{s.me_stat_footprint}</div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-[#151516]">{s.me_orders_title}</span>
            <div className="flex items-center text-xs text-[#9C9C9C]">
              <span>{s.me_orders_all}</span>
              <IcNavForward size={14} />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1 pt-1">
            {orderActions.map((act) => (
              <div key={act.id} className="flex flex-col items-center gap-1.5">
                <act.icon size={22} className="text-[#151516]" strokeWidth={1.8} />
                <span className="text-[11px] text-[#58595B]">{act.label}</span>
              </div>
            ))}
          </div>

          {orders.length > 0 && (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              {orders.map((ord) => {
                const prod = products.find((p) => p.id === ord.productId);
                if (!prod) return null;
                return (
                  <div
                    key={ord.productId}
                    {...bindTap('home.product.open', { params: { id: prod.id } })}
                    className="flex items-center gap-2.5 bg-[#F9F9FB] rounded-lg p-2 cursor-pointer"
                  >
                    <img
                      src={getProductImage(prod.imageKey)}
                      alt={prod.title}
                      className="w-11 h-11 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#151516] truncate">
                        {prod.title}
                      </div>
                      <div className="text-[11px] text-[#E02E24] font-semibold mt-0.5">
                        {ord.statusText} · 共{ord.quantity}件
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Favorites Preview */}
        {favProducts.length > 0 && (
          <div className="bg-white rounded-xl p-3.5 space-y-2.5">
            <div className="text-[15px] font-bold text-[#151516]">{s.me_stat_fav}</div>
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
                    <div className="text-xs font-medium text-[#151516] truncate">{prod.title}</div>
                    <div className="text-xs font-bold text-[#E02E24] mt-1">
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
