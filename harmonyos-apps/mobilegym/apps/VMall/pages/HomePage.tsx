import React from 'react';
import TabBar from '../components/TabBar';
import { useVMallGestures } from '../hooks/useVMallGestures';
import defaultData from '../data/defaults.json';

// Assets
import bannerClean from '../assets/images/banner_clean.png';
import btnSearch from '../assets/images/btn_search.png';
import btnCart from '../assets/images/btn_cart.png';
import tagRules from '../assets/images/tag_rules_clean.png';

// 10 Category Icons
import icPhone from '../assets/images/16626.png';
import icWatch from '../assets/images/16628.png';
import icAudio from '../assets/images/16630.png';
import icOffice from '../assets/images/16632.png';
import icSmartPick from '../assets/images/16634.png';
import icHome from '../assets/images/16642.png';
import icCar from '../assets/images/16644.png';
import icPilot from '../assets/images/16646.png';
import icSubsidy from '../assets/images/16648.png';
import icEducation from '../assets/images/16650.png';

export const HomePage: React.FC<{ cartCount: number; onAddToCart: () => void }> = ({
  cartCount,
}) => {
  const { bindTap } = useVMallGestures();

  // 金刚位图标顺序与 defaults.json 的 categories 一一对应
  const categories = [
    { name: '华为手机', icon: icPhone },
    { name: '运动健康', icon: icWatch },
    { name: '影音娱乐', icon: icAudio },
    { name: '智慧办公', icon: icOffice },
    { name: '鸿蒙智选', icon: icSmartPick },
    { name: '鸿蒙智家', icon: icHome },
    { name: '鸿蒙智行', icon: icCar },
    { name: '乾崑智驾', icon: icPilot },
    { name: '国家补贴', icon: icSubsidy },
    { name: '教育优惠', icon: icEducation },
  ];

  return (
    <div
      className="h-full w-full bg-[#F1F3F5] flex flex-col relative overflow-hidden select-none font-sans"
      data-page="home"
    >
      {/* Real-Device Style Header */}
      <div className="bg-white px-5 pt-10 pb-2 flex-shrink-0 z-20 flex items-center justify-between">
        <span className="text-[26px] font-bold text-[#191919] tracking-tight">
          首页
        </span>
        <div className="flex items-center gap-2.5">
          <button
            {...bindTap('home.search.open')}
            className="w-9 h-9 flex items-center justify-center active:scale-90 transition-transform"
            aria-label="搜索"
          >
            <img
              src={btnSearch}
              alt="搜索"
              className="w-full h-full object-contain"
            />
          </button>
          <button
            {...bindTap('cart.open')}
            className="w-9 h-9 flex items-center justify-center relative active:scale-90 transition-transform"
            aria-label="购物车"
          >
            <img
              src={btnCart}
              alt="购物车"
              className="w-full h-full object-contain"
            />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C7000B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Scroll Content */}
      <div
        className="flex-1 overflow-y-auto pb-24 relative no-scrollbar"
        data-scroll-container="main"
        data-scroll-direction="vertical"
      >
        {/* Hero Swiper Banner */}
        <div className="bg-white px-3 pb-3">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={bannerClean}
              alt="华为阔家族"
              className="w-full h-auto object-cover select-none pointer-events-none"
            />
          </div>
        </div>

        {/* 10-Grid Category Section */}
        <div className="relative bg-[#F1F3F5] pt-3 pb-2 px-2">
          {/* Floating '资质与规则' Tab on Left */}
          <div className="absolute left-0 bottom-4 z-10 pointer-events-none">
            <img
              src={tagRules}
              alt="资质与规则"
              className="h-12 w-auto object-contain opacity-75"
            />
          </div>

          <div className="grid grid-cols-5 gap-y-3.5 gap-x-1 pl-4 pr-2">
            {categories.map((cat) => (
              <div
                key={cat.name}
                {...bindTap('home.category.open', { params: { cat: cat.name } })}
                className="flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform group"
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="w-11 h-11 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11.5px] text-[#191919] font-normal mt-1 leading-tight tracking-tight text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Promotion Section: 周二智慧办公品类日 */}
        <div className="px-3 mt-2">
          <div
            {...bindTap('home.promo.open')}
            className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-[17px] font-bold text-[#191919] tracking-tight">
                周二智慧办公品类日
              </span>
              <span className="text-gray-400 text-sm font-semibold">›</span>
            </div>
            <div className="text-center text-[12.5px] text-[#222222] font-medium mb-3">
              至高优惠{' '}
              <span className="text-[#C7000B] font-bold">1000 元</span> |
              国家补贴至高{' '}
              <span className="text-[#C7000B] font-bold">1500 元</span>
            </div>

            {/* Featured Office Products */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
              <div className="bg-[#F8F9FA] rounded-xl p-2.5 flex flex-col items-center text-center">
                <div className="w-10 h-10 flex items-center justify-center mb-1">
                  <img
                    src={icOffice}
                    alt="MateBook"
                    className="w-9 h-9 object-contain"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#191919] line-clamp-1">
                  MateBook X Pro
                </span>
                <span className="text-[10px] text-[#C7000B] font-semibold mt-0.5">
                  省 1000 元
                </span>
                <span className="text-[11px] font-extrabold text-[#191919] mt-0.5">
                  ¥11,999
                </span>
              </div>

              <div className="bg-[#F8F9FA] rounded-xl p-2.5 flex flex-col items-center text-center">
                <div className="w-10 h-10 flex items-center justify-center mb-1">
                  <img
                    src={icPhone}
                    alt="MatePad"
                    className="w-9 h-9 object-contain"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#191919] line-clamp-1">
                  MatePad Pro 12.2
                </span>
                <span className="text-[10px] text-[#C7000B] font-semibold mt-0.5">
                  补贴 15%
                </span>
                <span className="text-[11px] font-extrabold text-[#191919] mt-0.5">
                  ¥4,199
                </span>
              </div>

              <div className="bg-[#F8F9FA] rounded-xl p-2.5 flex flex-col items-center text-center">
                <div className="w-10 h-10 flex items-center justify-center mb-1">
                  <img
                    src={icSmartPick}
                    alt="智慧屏"
                    className="w-9 h-9 object-contain"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#191919] line-clamp-1">
                  MateView SE
                </span>
                <span className="text-[10px] text-[#C7000B] font-semibold mt-0.5">
                  特惠立减
                </span>
                <span className="text-[11px] font-extrabold text-[#191919] mt-0.5">
                  ¥649
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hot Products Section */}
        <div className="px-3 mt-3 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[15px] font-bold text-[#191919] tracking-tight">
              热销精选推荐
            </h3>
            <span className="text-[11px] text-gray-400">官方正品 · 顺丰包邮</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {defaultData.products.map((product) => {
              const prodIcon =
                product.category === '华为手机'
                  ? icPhone
                  : product.category === '运动健康'
                    ? icWatch
                    : product.category === '影音娱乐'
                      ? icAudio
                      : product.category === '智慧办公'
                        ? icOffice
                        : icCar;

              return (
                <div
                  key={product.id}
                  {...bindTap('home.product.open', { params: { id: product.id } })}
                  className="bg-white rounded-2xl p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
                >
                  <div>
                    <div className="h-28 bg-[#F8F9FA] rounded-xl flex items-center justify-center mb-2.5 relative">
                      <img
                        src={prodIcon}
                        alt={product.name}
                        className="w-20 h-20 object-contain drop-shadow-sm"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-[#C7000B] text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                        {product.tag}
                      </span>
                    </div>

                    <h4 className="text-[13px] font-bold text-[#191919] line-clamp-1 mb-1">
                      {product.name}
                    </h4>
                    <p className="text-[10.5px] text-gray-500 line-clamp-2 leading-relaxed mb-2">
                      {product.desc}
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-gray-50">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs text-[#C7000B] font-bold">¥</span>
                      <span className="text-base text-[#C7000B] font-extrabold tracking-tight">
                        {product.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[9px] text-gray-400">
                      {product.sales}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom TabBar */}
      <TabBar />
    </div>
  );
};

export default HomePage;
