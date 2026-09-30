import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useQQBrowserStrings } from '../hooks/useQQBrowserStrings';
import { useQQBrowserGestures } from '../hooks/useQQBrowserGestures';
import { useQQBrowserStore } from '../state';
import { IcNavBack, IcSearch, IcTrash, IcFlame } from '../res/icons';

export const SearchPage: React.FC = () => {
  const s = useQQBrowserStrings();
  const { bindTap, bindBack } = useQQBrowserGestures();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [inputVal, setInputVal] = useState(queryParam || 'DeepSeek 满血版在线体验');

  const { articles, searchHistory, searchHotKeywords } = useQQBrowserStore(
    useShallow((st) => ({
      articles: st.articles,
      searchHistory: st.searchHistory,
      searchHotKeywords: st.searchHotKeywords,
    })),
  );
  const addSearchHistory = useQQBrowserStore((st) => st.addSearchHistory);
  const clearSearchHistory = useQQBrowserStore((st) => st.clearSearchHistory);

  const matchedArticles = queryParam
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          a.summary.toLowerCase().includes(queryParam.toLowerCase()) ||
          a.source.toLowerCase().includes(queryParam.toLowerCase()) ||
          articles.length > 0,
      )
    : [];

  return (
    <div
      className="flex flex-col h-full bg-[#F5F7FA] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Search Bar */}
      <div className="bg-white px-3 py-2 flex items-center gap-2 border-b border-gray-100">
        <div {...bindBack()} className="p-1 cursor-pointer text-[#11192D]">
          <IcNavBack size={22} />
        </div>
        <div className="flex-1 flex items-center h-9 rounded-full border border-[#0066FF] bg-white pl-3 pr-1">
          <IcSearch size={16} className="text-[#8A94A6] mr-1.5" />
          <input
            type="text"
            value={inputVal}
            data-action="search.input.change"
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={s.search_placeholder}
            className="flex-1 text-sm text-[#11192D] outline-none bg-transparent"
          />
          <div
            {...bindTap('search.submit', {
              params: { q: inputVal.trim() || 'DeepSeek' },
              beforeTrigger: () => addSearchHistory(inputVal.trim() || 'DeepSeek'),
            })}
            className="h-7 px-3.5 rounded-full bg-[#0066FF] text-white text-xs font-semibold flex items-center justify-center cursor-pointer"
          >
            {s.search_btn}
          </div>
        </div>
      </div>

      {/* Results or Discover */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-4"
        data-scroll-container="search-results"
        data-scroll-direction="vertical"
      >
        {!queryParam ? (
          <>
            {searchHistory.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#11192D]">{s.search_history_title}</span>
                  <div
                    {...bindTap(
                      { kind: 'action', id: 'search.history.clear' },
                      { onTrigger: () => clearSearchHistory() },
                    )}
                    className="flex items-center gap-1 text-xs text-[#8A94A6] cursor-pointer"
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
              <div className="flex items-center gap-1">
                <IcFlame size={15} className="text-[#FF3B30]" />
                <span className="text-xs font-bold text-[#11192D]">{s.search_hot_title}</span>
              </div>
              <div className="bg-white rounded-2xl p-2 divide-y divide-gray-50">
                {searchHotKeywords.map((kw, idx) => (
                  <div
                    key={kw}
                    {...bindTap('search.submit', {
                      params: { q: kw },
                      beforeTrigger: () => {
                        setInputVal(kw);
                        addSearchHistory(kw);
                      },
                    })}
                    className="py-2.5 px-2 flex items-center gap-2.5 cursor-pointer active:bg-gray-50"
                  >
                    <span
                      className={`w-5 text-center text-xs font-bold ${
                        idx < 3 ? 'text-[#FF3B30]' : 'text-[#8A94A6]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs text-[#11192D] font-medium truncate">{kw}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2.5">
            {matchedArticles.map((art) => (
              <div
                key={art.id}
                {...bindTap('home.article.open', { params: { id: art.id } })}
                className="bg-white rounded-2xl p-3.5 space-y-1.5 cursor-pointer active:opacity-95 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
              >
                <div className="text-sm font-bold text-[#0066FF] leading-snug">{art.title}</div>
                <p className="text-xs text-[#50607A] line-clamp-2 leading-relaxed">{art.summary}</p>
                <div className="text-[11px] text-[#8A94A6]">
                  {art.source} · {art.readCountText}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
