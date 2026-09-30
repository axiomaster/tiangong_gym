import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useQQBrowserStrings } from '../hooks/useQQBrowserStrings';
import { useQQBrowserGestures } from '../hooks/useQQBrowserGestures';
import { useQQBrowserStore } from '../state';
import { QQBROWSER_ASSETS } from '../data';
import { IcBookmark, IcClock, IcDownload, IcSettings, IcSparkles } from '../res/icons';

export const MePage: React.FC = () => {
  const s = useQQBrowserStrings();
  const { bindTap } = useQQBrowserGestures();

  const { user, articles } = useQQBrowserStore(
    useShallow((st) => ({
      user: st.user,
      articles: st.articles,
    })),
  );

  const bookmarkedArticles = articles.filter((a) => a.bookmarked);

  return (
    <div
      className="flex flex-col h-full bg-[#F5F7FA] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3"
        data-scroll-container="me-main"
        data-scroll-direction="vertical"
      >
        {/* User Profile Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white p-2 shadow-xs flex items-center justify-center">
              <img
                src={QQBROWSER_ASSETS.tabHome}
                alt={user.nickname}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-[17px] font-bold text-[#11192D]">{user.nickname}</div>
              <div className="text-xs text-[#8A94A6] mt-0.5">
                {user.qqAccount} · 云盘 {user.cloudUsedText}
              </div>
            </div>
          </div>
          <div className="p-2 text-[#50607A]">
            <IcSettings size={20} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-white rounded-2xl py-3 px-2 grid grid-cols-3 text-center shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div>
            <div className="flex items-center justify-center gap-1 text-[16px] font-bold text-[#11192D]">
              <IcBookmark size={15} className="text-[#0066FF]" />
              <span>{bookmarkedArticles.length}</span>
            </div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_bookmarks_title}</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[16px] font-bold text-[#11192D]">
              <IcClock size={15} className="text-[#0066FF]" />
              <span>{user.historyCount}</span>
            </div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_history_title}</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[16px] font-bold text-[#11192D]">
              <IcDownload size={15} className="text-[#0066FF]" />
              <span>{user.downloadsCount}</span>
            </div>
            <div className="text-[11px] text-[#50607A] mt-0.5">{s.me_downloads_title}</div>
          </div>
        </div>

        {/* QBot / DeepSeek Card */}
        <div
          {...bindTap('home.article.open', { params: { id: 'art_deepseek_r1' } })}
          className="rounded-2xl bg-gradient-to-r from-[#162238] to-[#243B61] p-3.5 text-white flex items-center justify-between cursor-pointer active:opacity-95"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <IcSparkles size={16} className="text-[#59A6FF]" />
              <span>{s.me_qbot_card}</span>
            </div>
            <div className="text-[11px] text-white/80">{s.me_qbot_sub}</div>
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="bg-white rounded-2xl p-3.5 space-y-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="text-[15px] font-bold text-[#11192D]">{s.me_bookmarks_title}</div>
          <div className="space-y-2">
            {(bookmarkedArticles.length > 0 ? bookmarkedArticles : articles.slice(0, 2)).map(
              (art) => (
                <div
                  key={art.id}
                  {...bindTap('home.article.open', { params: { id: art.id } })}
                  className="p-2.5 rounded-xl bg-[#F5F7FA] cursor-pointer active:bg-gray-100 space-y-1"
                >
                  <div className="text-xs font-semibold text-[#11192D] line-clamp-1">
                    {art.title}
                  </div>
                  <div className="text-[11px] text-[#8A94A6]">
                    {art.source} · {art.readCountText}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
