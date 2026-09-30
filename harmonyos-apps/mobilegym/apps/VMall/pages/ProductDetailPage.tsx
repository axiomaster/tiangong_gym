import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useVMallGestures } from '../hooks/useVMallGestures';
import {
  IcBack,
  IcShare,
  IcCart,
  IcHeart,
  IcCheck,
  IcShield,
  IcTruck,
} from '../res/icons';
import defaultData from '../data/defaults.json';
import icPhone from '../assets/images/16626.png';
import icWatch from '../assets/images/16628.png';
import icAudio from '../assets/images/16630.png';
import icOffice from '../assets/images/16632.png';
import icCar from '../assets/images/16644.png';

export const ProductDetailPage: React.FC<{
  cartCount: number;
  onAddToCart: () => void;
}> = ({ cartCount, onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const { bindTap, bindBack } = useVMallGestures();

  const product =
    defaultData.products.find((p) => p.id === id) || defaultData.products[0];

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSpec, setSelectedSpec] = useState(product.specs[0]);
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    onAddToCart();
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="h-full w-full bg-white flex flex-col relative select-none">
      {/* Top Floating Navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-10 pb-2 flex items-center justify-between">
        <button
          {...bindBack()}
          className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 active:scale-95 transition-transform"
        >
          <IcBack size={20} />
        </button>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 active:scale-95 transition-transform">
            <IcShare size={18} />
          </button>
          <button
            {...bindTap('cart.open')}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 active:scale-95 transition-transform relative"
          >
            <IcCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C7000B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 overflow-y-auto pb-20"
        data-scroll-container="main"
        data-scroll-direction="vertical"
      >
        {/* Product Visual Showcase */}
        <div className="h-72 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center relative pt-10">
          <img
            src={
              product.category === '华为手机'
                ? icPhone
                : product.category === '运动健康'
                  ? icWatch
                  : product.category === '影音娱乐'
                    ? icAudio
                    : product.category === '智慧办公'
                      ? icOffice
                      : icCar
            }
            alt={product.name}
            className="w-44 h-44 object-contain drop-shadow-md"
          />
          <span className="absolute bottom-4 left-4 bg-[#C7000B] text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {product.tag}
          </span>
        </div>

        {/* Product Info Block */}
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-[#C7000B] font-bold">¥</span>
              <span className="text-3xl text-[#C7000B] font-extrabold tracking-tight">
                {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ¥{product.originalPrice.toLocaleString()}
              </span>
              <span className="ml-auto text-xs text-gray-400">
                {product.sales}
              </span>
            </div>

            <h1 className="text-lg font-bold text-gray-900 mt-2">
              {product.name}
            </h1>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {product.desc}
            </p>
          </div>

          {/* Color Selection */}
          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 mb-2">选择机身配色</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  {...bindTap(
                    { kind: 'action', id: 'product.color.choose' },
                    { params: { value: c }, onTrigger: () => setSelectedColor(c) }
                  )}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedColor === c
                      ? 'border-[#C7000B] bg-red-50 text-[#C7000B] font-bold'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Specs Selection */}
          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 mb-2">选择规格配置</h3>
            <div className="flex flex-wrap gap-2">
              {product.specs.map((s) => (
                <button
                  key={s}
                  {...bindTap(
                    { kind: 'action', id: 'product.spec.choose' },
                    { params: { value: s }, onTrigger: () => setSelectedSpec(s) }
                  )}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedSpec === s
                      ? 'border-[#C7000B] bg-red-50 text-[#C7000B] font-bold'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Service Guarantees */}
          <div className="bg-gray-50 rounded-2xl p-3 space-y-1.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <IcCheck size={14} className="text-green-600 flex-shrink-0" />
              <span>官方正品 · 华为终端品质保障</span>
            </div>
            <div className="flex items-center gap-2">
              <IcTruck size={14} className="text-blue-600 flex-shrink-0" />
              <span>顺丰速运 · 全国核心城市次日达</span>
            </div>
            <div className="flex items-center gap-2">
              <IcShield size={14} className="text-orange-500 flex-shrink-0" />
              <span>全国联保 · 7天无理由退货 · 15天免费换货</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {addedToast && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-4 py-2 rounded-xl backdrop-blur-md z-40 animate-fade-in">
          已成功加入购物车！
        </div>
      )}

      {/* Bottom Action Dock */}
      <div className="bg-white border-t border-gray-100 px-4 py-2.5 flex items-center justify-between gap-3 flex-shrink-0 z-30">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="flex flex-col items-center gap-0.5 text-[10px]">
            <IcHeart size={18} />
            <span>收藏</span>
          </button>
          <button
            {...bindTap('cart.open')}
            className="flex flex-col items-center gap-0.5 text-[10px] relative"
          >
            <IcCart size={18} />
            <span>购物车</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C7000B] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 flex gap-2">
          <button
            {...bindTap(
              { kind: 'action', id: 'product.cart.add' },
              { params: { id: product.id }, onTrigger: handleAddToCart }
            )}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-full text-xs font-bold active:scale-95 transition-transform shadow-xs"
          >
            加入购物车
          </button>
          <button
            {...bindTap(
              { kind: 'action', id: 'product.buyNow.submit' },
              { params: { id: product.id }, onTrigger: handleAddToCart }
            )}
            className="flex-1 bg-gradient-to-r from-[#C7000B] to-red-600 text-white py-2.5 rounded-full text-xs font-bold active:scale-95 transition-transform shadow-xs"
          >
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
