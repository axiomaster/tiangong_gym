import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useBaiduNetdiskStrings } from '../hooks/useBaiduNetdiskStrings';
import { useBaiduNetdiskGestures } from '../hooks/useBaiduNetdiskGestures';
import { useBaiduNetdiskStore } from '../state';
import { getFileIcon } from '../data';
import { IcNavBack, IcSearch, IcTrash } from '../res/icons';

export const SearchPage: React.FC = () => {
  const s = useBaiduNetdiskStrings();
  const { bindTap, bindBack } = useBaiduNetdiskGestures();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [inputVal, setInputVal] = useState(queryParam || 'PP-OCRv5_server-onnx');

  const { files, searchHistory, searchDiscover } = useBaiduNetdiskStore(
    useShallow((st) => ({
      files: st.files,
      searchHistory: st.searchHistory,
      searchDiscover: st.searchDiscover,
    })),
  );
  const addSearchHistory = useBaiduNetdiskStore((st) => st.addSearchHistory);
  const clearSearchHistory = useBaiduNetdiskStore((st) => st.clearSearchHistory);

  const matchedFiles = queryParam
    ? files.filter(
        (f) =>
          f.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          f.description.toLowerCase().includes(queryParam.toLowerCase()) ||
          f.subText.toLowerCase().includes(queryParam.toLowerCase()),
      )
    : [];

  return (
    <div
      className="flex flex-col h-full bg-[#F4F7FC] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Search Bar */}
      <div className="bg-white px-3 py-2 flex items-center gap-2 border-b border-gray-100">
        <div {...bindBack()} className="p-1 cursor-pointer text-[#191C24]">
          <IcNavBack size={22} />
        </div>
        <div className="flex-1 flex items-center h-9 rounded-full border border-[#191C24] bg-white pl-3 pr-1">
          <IcSearch size={16} className="text-[#8B919E] mr-1.5" />
          <input
            type="text"
            value={inputVal}
            data-action="search.input.change"
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={s.search_placeholder}
            className="flex-1 text-sm text-[#191C24] outline-none bg-transparent"
          />
          <div
            {...bindTap('search.submit', {
              params: { q: inputVal.trim() || 'PP-OCRv5_server-onnx' },
              beforeTrigger: () => addSearchHistory(inputVal.trim() || 'PP-OCRv5_server-onnx'),
            })}
            className="h-7 px-3.5 rounded-full bg-[#06A7FF] text-white text-xs font-semibold flex items-center justify-center cursor-pointer"
          >
            {s.search_btn}
          </div>
        </div>
      </div>

      {/* Results & History */}
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
                  <span className="text-xs font-bold text-[#191C24]">
                    {s.search_history_title}
                  </span>
                  <div
                    {...bindTap(
                      { kind: 'action', id: 'search.history.clear' },
                      { onTrigger: () => clearSearchHistory() },
                    )}
                    className="flex items-center gap-1 text-xs text-[#8B919E] cursor-pointer"
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
                      className="px-3 py-1.5 rounded-full bg-white text-xs text-[#737987] cursor-pointer active:bg-gray-100"
                    >
                      {kw}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#191C24]">{s.search_discover_title}</span>
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
                    className="px-3 py-2 rounded-xl bg-white text-xs text-[#191C24] truncate cursor-pointer active:bg-gray-50"
                  >
                    {kw}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : matchedFiles.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#8B919E]">{s.search_no_results}</div>
        ) : (
          <div className="space-y-2">
            {matchedFiles.map((file) => (
              <div
                key={file.id}
                {...bindTap('file.detail.open', { params: { id: file.id } })}
                className="bg-white rounded-2xl p-3 flex items-center gap-3 cursor-pointer active:opacity-90"
              >
                <img
                  src={getFileIcon(file)}
                  alt={file.title}
                  className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#191C24] truncate">{file.title}</div>
                  <div className="text-xs text-[#8B919E] mt-0.5 truncate">
                    {file.sizeText} · {file.locationPath}
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
