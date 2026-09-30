import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDouyinStrings } from '../hooks/useDouyinStrings';
import { useDouyinGestures } from '../hooks/useDouyinGestures';
import { useDouyinStore } from '../state';
import { DOUYIN_ASSETS } from '../data';
import { IcNavBack, IcSearch, IcFlame } from '../res/icons';

export const SearchPage: React.FC = () => {
  const s = useDouyinStrings();
  const { bindTap, bindBack } = useDouyinGestures();
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const [inputVal, setInputVal] = useState(qParam || s.search_placeholder);

  const hotSearches = useDouyinStore((st) => st.hotSearches);
  const mainVideo = useDouyinStore((st) => st.mainVideo);

  return (
    <div
      className="flex flex-col h-full bg-[#12121A] text-white pt-10"
      data-status-bar-foreground="light"
      data-navigation-bar-foreground="light"
    >
      <div className="px-3 py-2.5 flex items-center gap-2 border-b border-white/10">
        <div {...bindBack()} className="p-1 cursor-pointer text-white">
          <IcNavBack size={22} />
        </div>
        <div className="flex-1 flex items-center h-9 rounded-lg bg-white/10 px-3">
          <IcSearch size={16} className="text-white/50 mr-2" />
          <input
            type="text"
            value={inputVal}
            data-action="search.input.change"
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={s.search_placeholder}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
          />
        </div>
        <div
          {...bindTap('search.submit', {
            params: { q: inputVal.trim() || s.search_placeholder },
          })}
          className="px-2.5 py-1.5 text-sm font-bold text-[#FE2C55] cursor-pointer"
        >
          {s.search_btn}
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4"
        data-scroll-container="search-main"
        data-scroll-direction="vertical"
      >
        {qParam ? (
          <div className="bg-[#1C1C28] rounded-xl overflow-hidden border border-white/10">
            <img
              src={DOUYIN_ASSETS.videoMain}
              alt={mainVideo.captionFull}
              className="w-full aspect-video object-cover"
            />
            <div className="p-3 space-y-1.5">
              <div className="text-sm font-bold text-white">{mainVideo.authorHandle}</div>
              <p className="text-xs text-white/80">{mainVideo.captionFull}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#FACE15]">
              <IcFlame size={16} />
              <span>{s.search_hot_title}</span>
            </div>
            <div className="space-y-2.5">
              {hotSearches.map((item, index) => (
                <div
                  key={item}
                  {...bindTap('search.submit', {
                    params: { q: item },
                    beforeTrigger: () => setInputVal(item),
                  })}
                  className="flex items-center gap-3 py-1.5 cursor-pointer active:opacity-75"
                >
                  <span
                    className={`w-5 text-sm font-bold ${
                      index < 3 ? 'text-[#FE2C55]' : 'text-white/45'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
