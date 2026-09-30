import React, { useState } from 'react';
import { useVMallGestures } from '../hooks/useVMallGestures';
import { IcBack, IcShield } from '../res/icons';
import defaultData from '../data/defaults.json';

export const CartPage: React.FC<{
  cartCount: number;
  onClearCart: () => void;
}> = ({ cartCount, onClearCart }) => {
  const { bindTap, bindBack } = useVMallGestures();
  const [checkoutToast, setCheckoutToast] = useState(false);
  const sampleItem = defaultData.products[0];

  const handleCheckout = () => {
    setCheckoutToast(true);
    setTimeout(() => setCheckoutToast(false), 2000);
  };

  return (
    <div className="h-full w-full bg-[#f4f4f4] flex flex-col relative select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            {...bindBack()}
            className="p-1 text-gray-700 hover:text-gray-900"
          >
            <IcBack size={20} />
          </button>
          <h2 className="text-base font-bold text-gray-900">
            购物车 ({cartCount})
          </h2>
        </div>
        {cartCount > 0 && (
          <button
            {...bindTap(
              { kind: 'action', id: 'cart.items.clear' },
              { onTrigger: onClearCart }
            )}
            className="text-xs text-gray-400 hover:text-[#C7000B]"
          >
            清空
          </button>
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-3 pb-24"
        data-scroll-container="main"
        data-scroll-direction="vertical"
      >
        {cartCount === 0 ? (
          <div className="py-20 text-center space-y-3">
            <span className="text-5xl block">🛒</span>
            <p className="text-sm font-medium text-gray-600">购物车空空如也</p>
            <button
              {...bindTap('cart.goHome')}
              className="bg-[#C7000B] text-white text-xs px-6 py-2 rounded-full font-bold shadow-xs active:scale-95 transition-transform"
            >
              去选购热销爆款
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex gap-3 items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              📱
            </div>
            <div className="flex-1 min-w-0">
              <span className="bg-red-50 text-[#C7000B] text-[9px] px-1.5 py-0.5 rounded font-medium">
                官方自营
              </span>
              <h4 className="text-xs font-bold text-gray-900 truncate mt-1">
                {sampleItem.name}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                羽砂黑 · 16GB+512GB
              </p>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-sm font-extrabold text-[#C7000B]">
                  ¥{sampleItem.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  × {cartCount}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-3 text-center text-gray-400 text-xs flex items-center justify-center gap-1">
          <IcShield size={14} className="text-green-600" />
          <span>华为商城自营品质 · 官方正品保障</span>
        </div>
      </div>

      {/* Checkout Toast */}
      {checkoutToast && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-4 py-2 rounded-xl backdrop-blur-md z-40 animate-fade-in">
          订单提交成功！感谢选购华为商城。
        </div>
      )}

      {/* Bottom Checkout Bar */}
      {cartCount > 0 && (
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <span className="text-xs text-gray-500">合计: </span>
            <span className="text-base font-extrabold text-[#C7000B]">
              ¥{(sampleItem.price * cartCount).toLocaleString()}
            </span>
          </div>
          <button
            {...bindTap(
              { kind: 'action', id: 'cart.checkout.submit' },
              { onTrigger: handleCheckout }
            )}
            className="bg-[#C7000B] text-white px-8 py-2.5 rounded-full text-xs font-bold active:scale-95 transition-transform shadow-xs"
          >
            去结算 ({cartCount})
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
