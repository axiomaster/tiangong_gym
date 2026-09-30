import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useMeituanStrings } from '../hooks/useMeituanStrings';
import { useMeituanGestures } from '../hooks/useMeituanGestures';
import { useMeituanStore } from '../state';
import { getDealImage } from '../data';
import { IcNavBack, IcSearch, IcTrash } from '../res/icons';

export const SearchPage: React.FC = () => {
  const s = useMeituanStrings();
  const { bindTap, bindBack } = useMeituanGestures();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [inputVal, setInputVal] = useState(queryParam || s.search_placeholder);

  const { deals, searchHistory, searchDiscover } = useMeituanStore(
    useShallow((st) => ({
      deals: st.deals,
      searchHistory: st.searchHistory,
      searchDiscover: st.searchDiscover,
    })),
  );
  const addSearchHistory = useMeituanStore((st) => st.addSearchHistory);
  const clearSearchHistory = useMeituanStore((st) => st.clearSearchHistory);

  const matchedDeals = queryParam
    ? deals.filter(
        (d) =>
          d.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          d.shopName.toLowerCase().includes(queryParam.toLowerCase()) ||
          queryParam === s.search_placeholder,
      )
    : [];

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6]"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Search Input Row */}
      <div className="bg-[#FFD100] pt-10 pb-2.5 px-3 flex items-center gap-2">
        <div {...bindBack()} className="p-1 cursor-pointer text-[#111111]">
          <IcNavBack size={22} />
        </div>
        <div className="flex-1 flex items-center h-9 rounded-full bg-white pl-3 pr-1">
          <IcSearch size={16} className="text-[#888888] mr-1.5" />
          <input
            type="text"
            value={inputVal}
            data-action="search.input.change"
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={s.search_placeholder}
            className="flex-1 text-sm text-[#111111] outline-none bg-transparent"
          />
          <div
            {...bindTap('search.submit', {
              params: { q: inputVal.trim() || s.search_placeholder },
              beforeTrigger: () => addSearchHistory(inputVal.trim() || s.search_placeholder),
            })}
            className="h-7 px-3.5 rounded-full bg-[#FFD100] text-[#111111] text-xs font-bold flex items-center justify-center cursor-pointer"
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
                  <span className="text-xs font-bold text-[#111111]">{s.search_history_title}</span>
                  <div
                    {...bindTap(
                      { kind: 'action', id: 'search.history.clear' },
                      { onTrigger: () => clearSearchHistory() },
                    )}
                    className="flex items-center gap-1 text-xs text-[#888888] cursor-pointer"
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
                      className="px-3 py-1.5 rounded-full bg-white text-xs text-[#50607A] cursor-pointer active:bg-gray-100"
                    >
                      {kw}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#111111]">{s.search_discover_title}</span>
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
                    className="px-3 py-2 rounded-lg bg-white text-xs text-[#111111] truncate cursor-pointer active:bg-gray-50"
                  >
                    {kw}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : matchedDeals.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#888888]">{s.search_no_results}</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {matchedDeals.map((deal) => (
              <div
                key={deal.id}
                {...bindTap('home.deal.open', { params: { id: deal.id } })}
                className="bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer active:opacity-95"
              >
                <div className="aspect-[5/4] bg-gray-50 overflow-hidden">
                  <img
                    src={getDealImage(deal.imageKey)}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-bold text-[#111111] line-clamp-2">
                    {deal.shortTitle}
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className="text-sm font-extrabold text-[#FF2D19]">
                      {s.currency_symbol}
                      {deal.priceText}
                    </span>
                    <span className="text-[10px] text-[#888888]">{deal.salesText}</span>
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
