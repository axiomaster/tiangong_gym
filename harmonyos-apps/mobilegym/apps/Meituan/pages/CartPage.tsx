import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMeituanStrings } from '../hooks/useMeituanStrings';
import { useMeituanGestures } from '../hooks/useMeituanGestures';
import { useMeituanStore } from '../state';
import { getDealImage } from '../data';
import { IcCheck, IcPlus, IcMinus, IcStore } from '../res/icons';

export const CartPage: React.FC = () => {
  const s = useMeituanStrings();
  const { bindTap } = useMeituanGestures();
  const { cart, deals, lastOrderSuccess } = useMeituanStore(
    useShallow((st) => ({
      cart: st.cart,
      deals: st.deals,
      lastOrderSuccess: st.lastOrderSuccess,
    })),
  );
  const toggleCartItem = useMeituanStore((st) => st.toggleCartItem);
  const toggleAllCartItems = useMeituanStore((st) => st.toggleAllCartItems);
  const updateCartQuantity = useMeituanStore((st) => st.updateCartQuantity);
  const checkoutCart = useMeituanStore((st) => st.checkoutCart);

  const allSelected = cart.length > 0 && cart.every((item) => item.selected);
  const selectedTotal = cart.reduce((sum, item) => {
    if (!item.selected) return sum;
    const deal = deals.find((d) => d.id === item.dealId);
    return sum + (deal ? deal.price * item.quantity : 0);
  }, 0);

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-[18px] font-bold text-[#111111]">
          {s.cart_title} ({cart.length})
        </span>
      </div>

      {lastOrderSuccess && (
        <div className="mx-3 mt-2 bg-[#FFF8D6] text-[#111111] text-xs font-semibold px-3 py-2 rounded-lg">
          {s.cart_checked_out_toast}
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-2.5"
        data-scroll-container="cart-list"
        data-scroll-direction="vertical"
      >
        {cart.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-[#888888] text-sm">
            {s.cart_empty}
          </div>
        ) : (
          cart.map((item) => {
            const deal = deals.find((d) => d.id === item.dealId);
            if (!deal) return null;
            return (
              <div key={item.dealId} className="bg-white rounded-xl p-3 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111111]">
                  <IcStore size={14} className="text-[#FFB800]" />
                  <span>{deal.shopName}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    {...bindTap(
                      { kind: 'action', id: 'cart.item.select.toggle' },
                      {
                        params: { dealId: item.dealId, to: !item.selected },
                        onTrigger: () => toggleCartItem(item.dealId),
                      },
                    )}
                    className={`w-5 h-5 rounded-full flex items-center justify-center border cursor-pointer flex-shrink-0 ${
                      item.selected
                        ? 'bg-[#FFD100] border-[#FFD100] text-[#111111]'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {item.selected && <IcCheck size={12} strokeWidth={3} />}
                  </div>

                  <div
                    {...bindTap('home.deal.open', { params: { id: deal.id } })}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={getDealImage(deal.imageKey)}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                    <div>
                      <div
                        {...bindTap('home.deal.open', { params: { id: deal.id } })}
                        className="text-[13px] font-bold text-[#111111] line-clamp-1 cursor-pointer"
                      >
                        {deal.shortTitle}
                      </div>
                      <div className="mt-1 inline-block text-[11px] text-[#50607A] bg-gray-100 px-2 py-0.5 rounded truncate max-w-full">
                        {item.spec}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-[#FF2D19] font-extrabold">
                        <span className="text-xs">{s.currency_symbol}</span>
                        <span className="text-[16px]">{deal.priceText}</span>
                      </div>

                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                        <div
                          {...bindTap(
                            { kind: 'action', id: 'cart.item.qty.change' },
                            {
                              params: { dealId: item.dealId, delta: -1 },
                              onTrigger: () => updateCartQuantity(item.dealId, -1),
                            },
                          )}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 active:bg-gray-100 cursor-pointer"
                        >
                          <IcMinus size={12} />
                        </div>
                        <span className="px-2.5 text-xs font-medium text-[#111111]">
                          {item.quantity}
                        </span>
                        <div
                          {...bindTap(
                            { kind: 'action', id: 'cart.item.qty.change' },
                            {
                              params: { dealId: item.dealId, delta: 1 },
                              onTrigger: () => updateCartQuantity(item.dealId, 1),
                            },
                          )}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 active:bg-gray-100 cursor-pointer"
                        >
                          <IcPlus size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Checkout Bar */}
      <div className="bg-white border-t border-gray-100 px-3.5 py-2 flex items-center justify-between">
        <div
          {...bindTap(
            { kind: 'action', id: 'cart.selectAll.toggle' },
            {
              params: { to: !allSelected },
              onTrigger: () => toggleAllCartItems(!allSelected),
            },
          )}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center border ${
              allSelected
                ? 'bg-[#FFD100] border-[#FFD100] text-[#111111]'
                : 'border-gray-300 bg-white'
            }`}
          >
            {allSelected && <IcCheck size={12} strokeWidth={3} />}
          </div>
          <span className="text-xs text-[#50607A]">{s.cart_select_all}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-[#111111]">{s.cart_total}</span>
            <span className="text-xs font-bold text-[#FF2D19]">{s.currency_symbol}</span>
            <span className="text-[18px] font-extrabold text-[#FF2D19]">
              {selectedTotal.toFixed(2)}
            </span>
          </div>
          <div
            {...bindTap(
              { kind: 'action', id: 'cart.checkout.submit' },
              { onTrigger: () => checkoutCart() },
            )}
            className="px-5 py-2 rounded-full bg-[#FFD100] text-[#111111] text-sm font-bold cursor-pointer active:opacity-90"
          >
            {s.cart_checkout}
          </div>
        </div>
      </div>
    </div>
  );
};
