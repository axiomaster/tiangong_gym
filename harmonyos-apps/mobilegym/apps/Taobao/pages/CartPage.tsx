import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTaobaoStrings } from '../hooks/useTaobaoStrings';
import { useTaobaoGestures } from '../hooks/useTaobaoGestures';
import { useTaobaoStore } from '../state';
import { getProductImage } from '../data';
import { IcCheck, IcPlus, IcMinus, IcStore } from '../res/icons';

export const CartPage: React.FC = () => {
  const s = useTaobaoStrings();
  const { bindTap } = useTaobaoGestures();
  const { cart, products, lastOrderSuccess } = useTaobaoStore(
    useShallow((st) => ({
      cart: st.cart,
      products: st.products,
      lastOrderSuccess: st.lastOrderSuccess,
    })),
  );
  const toggleCartItem = useTaobaoStore((st) => st.toggleCartItem);
  const toggleAllCartItems = useTaobaoStore((st) => st.toggleAllCartItems);
  const updateCartQuantity = useTaobaoStore((st) => st.updateCartQuantity);
  const checkoutCart = useTaobaoStore((st) => st.checkoutCart);

  const allSelected = cart.length > 0 && cart.every((item) => item.selected);
  const selectedTotal = cart.reduce((sum, item) => {
    if (!item.selected) return sum;
    const prod = products.find((p) => p.id === item.productId);
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-[18px] font-bold text-[#11192D]">
          {s.cart_title} ({cart.length})
        </span>
      </div>

      {lastOrderSuccess && (
        <div className="mx-3 mt-2 bg-[#FFF0E8] text-[#FF5000] text-xs font-medium px-3 py-2 rounded-lg">
          {s.cart_checked_out_toast}
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-2.5"
        data-scroll-container="cart-list"
        data-scroll-direction="vertical"
      >
        {cart.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-[#7C889C] text-sm">
            {s.cart_empty}
          </div>
        ) : (
          cart.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <div key={item.productId} className="bg-white rounded-xl p-3 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#11192D]">
                  <IcStore size={14} className="text-[#FF5000]" />
                  <span>{product.shopName}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    {...bindTap(
                      { kind: 'action', id: 'cart.item.select.toggle' },
                      {
                        params: { productId: item.productId, to: !item.selected },
                        onTrigger: () => toggleCartItem(item.productId),
                      },
                    )}
                    className={`w-5 h-5 rounded-full flex items-center justify-center border cursor-pointer flex-shrink-0 ${
                      item.selected
                        ? 'bg-[#FF5000] border-[#FF5000] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {item.selected && <IcCheck size={12} strokeWidth={3} />}
                  </div>

                  <div
                    {...bindTap('home.product.open', { params: { id: product.id } })}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={getProductImage(product.imageKey)}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                    <div>
                      <div
                        {...bindTap('home.product.open', { params: { id: product.id } })}
                        className="text-[13px] font-medium text-[#11192D] line-clamp-1 cursor-pointer"
                      >
                        {product.title}
                      </div>
                      <div className="mt-1 inline-block text-[11px] text-[#7C889C] bg-gray-100 px-2 py-0.5 rounded">
                        {item.spec}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-[#FF5000] font-bold">
                        <span className="text-xs">{s.currency_symbol}</span>
                        <span className="text-[16px]">{product.priceText}</span>
                      </div>

                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                        <div
                          {...bindTap(
                            { kind: 'action', id: 'cart.item.qty.change' },
                            {
                              params: { productId: item.productId, delta: -1 },
                              onTrigger: () => updateCartQuantity(item.productId, -1),
                            },
                          )}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 active:bg-gray-100 cursor-pointer"
                        >
                          <IcMinus size={12} />
                        </div>
                        <span className="px-2.5 text-xs font-medium text-[#11192D]">
                          {item.quantity}
                        </span>
                        <div
                          {...bindTap(
                            { kind: 'action', id: 'cart.item.qty.change' },
                            {
                              params: { productId: item.productId, delta: 1 },
                              onTrigger: () => updateCartQuantity(item.productId, 1),
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
                ? 'bg-[#FF5000] border-[#FF5000] text-white'
                : 'border-gray-300 bg-white'
            }`}
          >
            {allSelected && <IcCheck size={12} strokeWidth={3} />}
          </div>
          <span className="text-xs text-[#50607A]">{s.cart_select_all}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-[#11192D]">{s.cart_total}</span>
            <span className="text-xs font-bold text-[#FF5000]">{s.currency_symbol}</span>
            <span className="text-[18px] font-bold text-[#FF5000]">
              {selectedTotal.toFixed(selectedTotal % 1 === 0 ? 0 : 1)}
            </span>
          </div>
          <div
            {...bindTap(
              { kind: 'action', id: 'cart.checkout.submit' },
              { onTrigger: () => checkoutCart() },
            )}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF7700] to-[#FF5000] text-white text-sm font-semibold cursor-pointer active:opacity-90"
          >
            {s.cart_checkout}
          </div>
        </div>
      </div>
    </div>
  );
};
