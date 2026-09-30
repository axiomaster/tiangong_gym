import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { usePinduoduoStrings } from '../hooks/usePinduoduoStrings';
import { usePinduoduoGestures } from '../hooks/usePinduoduoGestures';
import { usePinduoduoStore } from '../state';
import { getProductImage } from '../data';
import { IcNavBack, IcSearch, IcTrash } from '../res/icons';

export const SearchPage: React.FC = () => {
  const s = usePinduoduoStrings();
  const { bindTap, bindBack } = usePinduoduoGestures();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [inputVal, setInputVal] = useState(queryParam || s.search_placeholder);

  const { products, searchHistory, searchDiscover } = usePinduoduoStore(
    useShallow((st) => ({
      products: st.products,
      searchHistory: st.searchHistory,
      searchDiscover: st.searchDiscover,
    })),
  );
  const addSearchHistory = usePinduoduoStore((st) => st.addSearchHistory);
  const clearSearchHistory = usePinduoduoStore((st) => st.clearSearchHistory);

  const matchedProducts = queryParam
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          p.shopName.toLowerCase().includes(queryParam.toLowerCase()) ||
          queryParam === s.search_placeholder,
      )
    : [];

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Search Input Row */}
      <div className="bg-white px-3 py-2 flex items-center gap-2 border-b border-gray-100">
        <div {...bindBack()} className="p-1 cursor-pointer text-[#151516]">
          <IcNavBack size={22} />
        </div>
        <div className="flex-1 flex items-center h-9 rounded-lg bg-[#EDEDED] pl-3 pr-1">
          <IcSearch size={16} className="text-[#9C9C9C] mr-1.5" />
          <input
            type="text"
            value={inputVal}
            data-action="search.input.change"
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={s.search_placeholder}
            className="flex-1 text-sm text-[#151516] outline-none bg-transparent"
          />
          <div
            {...bindTap('search.submit', {
              params: { q: inputVal.trim() || s.search_placeholder },
              beforeTrigger: () => addSearchHistory(inputVal.trim() || s.search_placeholder),
            })}
            className="h-7 px-3.5 rounded-md bg-[#E02E24] text-white text-xs font-semibold flex items-center justify-center cursor-pointer"
          >
            {s.search_btn}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4"
        data-scroll-container="search-results"
        data-scroll-direction="vertical"
      >
        {!queryParam ? (
          <>
            {searchHistory.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#151516]">{s.search_history_title}</span>
                  <div
                    {...bindTap(
                      { kind: 'action', id: 'search.history.clear' },
                      { onTrigger: () => clearSearchHistory() },
                    )}
                    className="flex items-center gap-1 text-xs text-[#9C9C9C] cursor-pointer"
                  >
                    <IcTrash size={13} />
                    <span>{s.search_clear}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((kw) => (
                    <div
                      key={kw}
                      {...bindTap('search.submit', {
                        params: { q: kw },
                        beforeTrigger: () => setInputVal(kw),
                      })}
                      className="px-3 py-1.5 rounded-full bg-white text-xs text-[#58595B] cursor-pointer active:bg-gray-100"
                    >
                      {kw}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#151516]">{s.search_discover_title}</span>
              <div className="grid grid-cols-2 gap-2">
                {searchDiscover.map((kw) => (
                  <div
                    key={kw}
                    {...bindTap('search.submit', {
                      params: { q: kw },
                      beforeTrigger: () => {
                        setInputVal(kw);
                        addSearchHistory(kw);
                      },
                    })}
                    className="px-3 py-2 rounded-lg bg-white text-xs text-[#151516] truncate cursor-pointer active:bg-gray-50"
                  >
                    {kw}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : matchedProducts.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#9C9C9C]">{s.search_no_results}</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {matchedProducts.map((prod) => (
              <div
                key={prod.id}
                {...bindTap('home.product.open', { params: { id: prod.id } })}
                className="bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer active:opacity-95"
              >
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={getProductImage(prod.imageKey)}
                    alt={prod.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-medium text-[#151516] line-clamp-2">
                    {prod.title}
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className="text-sm font-bold text-[#E02E24]">
                      {s.currency_symbol}
                      {prod.priceText}
                    </span>
                    <span className="text-[10px] text-[#9C9C9C]">{prod.salesText}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
