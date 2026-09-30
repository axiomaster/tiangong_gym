import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useQQBrowserStrings } from '../hooks/useQQBrowserStrings';
import { useQQBrowserGestures } from '../hooks/useQQBrowserGestures';
import { useQQBrowserStore } from '../state';
import { IcBookmark, IcFlame, IcHeart } from '../res/icons';

export const FeedPage: React.FC = () => {
  const s = useQQBrowserStrings();
  const { bindTap } = useQQBrowserGestures();
  const [searchParams] = useSearchParams();
  const activeChannel = searchParams.get('channel') || 'all';

  const { articles } = useQQBrowserStore(
    useShallow((st) => ({
      articles: st.articles,
    })),
  );
  const toggleArticleBookmark = useQQBrowserStore((st) => st.toggleArticleBookmark);
  const toggleArticleLike = useQQBrowserStore((st) => st.toggleArticleLike);

  const channels = [
    { id: 'all', label: s.feed_ch_all },
    { id: 'hot', label: s.feed_ch_hot },
    { id: 'video', label: s.feed_ch_video },
    { id: 'tech', label: s.feed_ch_tech },
  ];

  const filteredArticles =
    activeChannel === 'all'
      ? articles
      : articles.filter((a) => a.category === activeChannel);

  return (
    <div
      className="flex flex-col h-full bg-[#F5F7FA] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Header & Channel Bar */}
      <div className="bg-white px-4 pt-2 pb-2.5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <IcFlame size={20} className="text-[#0066FF]" />
            <span className="text-[17px] font-bold text-[#11192D]">{s.feed_title}</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {channels.map((ch) => {
            const isActive = activeChannel === ch.id;
            return (
              <div
                key={ch.id}
                {...bindTap('feed.channel.switch', { params: { channel: ch.id } })}
                className={`relative pb-1 text-[14px] cursor-pointer transition-colors ${
                  isActive ? 'text-[#0066FF] font-bold' : 'text-[#50607A] font-medium'
                }`}
              >
                <span>{ch.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] rounded-full bg-[#0066FF]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Article Feed List */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5"
        data-scroll-container="feed-list"
        data-scroll-direction="vertical"
      >
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="bg-white rounded-2xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)] space-y-2"
          >
            <div
              {...bindTap('home.article.open', { params: { id: art.id } })}
              className="cursor-pointer space-y-1.5"
            >
              <div className="flex items-start gap-2">
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-bold flex-shrink-0 mt-0.5 ${
                    art.hotRank <= 2
                      ? 'bg-[#FF3B30] text-white'
                      : 'bg-[#EBF2FF] text-[#0066FF]'
                  }`}
                >
                  {art.hotRank}
                </span>
                <h3 className="text-[15px] font-bold text-[#11192D] leading-snug">
                  {art.title}
                </h3>
              </div>
              <p className="text-[13px] text-[#50607A] leading-relaxed line-clamp-2">
                {art.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-[#8A94A6]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#50607A]">{art.source}</span>
                <span>·</span>
                <span>{art.readCountText}</span>
                <span>·</span>
                <span>{art.timeText}</span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  {...bindTap(
                    { kind: 'action', id: 'feed.article.like.toggle' },
                    {
                      params: { articleId: art.id, to: !art.liked },
                      onTrigger: () => toggleArticleLike(art.id),
                    },
                  )}
                  className="flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <IcHeart
                    size={15}
                    className={art.liked ? 'text-[#FF3B30]' : 'text-[#8A94A6]'}
                    fill={art.liked ? 'currentColor' : 'none'}
                  />
                  <span className={art.liked ? 'text-[#FF3B30] font-medium' : ''}>
                    {art.likes}
                  </span>
                </div>

                <div
                  {...bindTap(
                    { kind: 'action', id: 'feed.article.bookmark.toggle' },
                    {
                      params: { articleId: art.id, to: !art.bookmarked },
                      onTrigger: () => toggleArticleBookmark(art.id),
                    },
                  )}
                  className="flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <IcBookmark
                    size={15}
                    className={art.bookmarked ? 'text-[#0066FF]' : 'text-[#8A94A6]'}
                    fill={art.bookmarked ? 'currentColor' : 'none'}
                  />
                  <span className={art.bookmarked ? 'text-[#0066FF] font-medium' : ''}>
                    {art.bookmarked ? s.article_bookmarked : s.article_bookmark}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
