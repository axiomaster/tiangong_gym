import React from 'react';
import { useSearchParams } from 'react-router-dom';
import TabBar from '../components/TabBar';
import { useVMallGestures } from '../hooks/useVMallGestures';
import defaultData from '../data/defaults.json';
import icPhone from '../assets/images/16626.png';
import icWatch from '../assets/images/16628.png';
import icAudio from '../assets/images/16630.png';
import icOffice from '../assets/images/16632.png';
import icCar from '../assets/images/16644.png';
import { IcSearch } from '../res/icons';

export const CategoryPage: React.FC = () => {
  const { bindTap } = useVMallGestures();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') ?? defaultData.categories[0];

  const products = defaultData.products.filter(
    (p) => p.category === activeCategory
  );

  return (
    <div className="h-full w-full bg-white flex flex-col relative select-none">
      {/* Header */}
      <div className="px-4 pt-10 pb-3 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">商品分类</h2>
        <div className="bg-gray-100 rounded-full h-8 px-3 flex items-center gap-1.5 w-44">
          <IcSearch size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">搜索分类商品</span>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex overflow-hidden pb-20">
        {/* Left sidebar */}
        <div
          className="w-24 bg-[#f8f9fa] border-r border-gray-100 overflow-y-auto no-scrollbar py-2"
          data-scroll-container="sidebar"
          data-scroll-direction="vertical"
        >
          {defaultData.categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                {...bindTap('category.select', { params: { cat } })}
                className={`w-full py-3 px-2 text-xs text-left relative transition-colors ${
                  isActive
                    ? 'bg-white font-bold text-[#C7000B]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#C7000B] rounded-r-full" />
                )}
                <span className="block truncate">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Right product list */}
        <div
          className="flex-1 overflow-y-auto p-3 space-y-2.5"
          data-scroll-container="main"
          data-scroll-direction="vertical"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-800">
              {activeCategory} · 推荐产品
            </span>
            <span className="text-[10px] text-gray-400">
              {products.length} 款
            </span>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400">
              暂无更多商品，正在补货中
            </div>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                {...bindTap('category.product.open', { params: { id: p.id } })}
                className="bg-gray-50/70 border border-gray-100 rounded-xl p-2.5 flex gap-3 items-center active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 shadow-xs">
                  <img
                    src={
                      p.category === '华为手机'
                        ? icPhone
                        : p.category === '运动健康'
                          ? icWatch
                          : p.category === '影音娱乐'
                            ? icAudio
                            : p.category === '智慧办公'
                              ? icOffice
                              : icCar
                    }
                    alt={p.name}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                    {p.desc}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-xs text-[#C7000B] font-bold">
                      ¥{p.price.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-gray-400 line-through">
                      ¥{p.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TabBar />
    </div>
  );
};

export default CategoryPage;
