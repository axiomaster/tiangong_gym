import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useQQBrowserStrings } from '../hooks/useQQBrowserStrings';
import { useQQBrowserGestures } from '../hooks/useQQBrowserGestures';
import { useQQBrowserStore } from '../state';
import { IcNavBack, IcBookmark, IcHeart, IcGlobe } from '../res/icons';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const s = useQQBrowserStrings();
  const { bindTap, bindBack } = useQQBrowserGestures();
  const [commentText, setCommentText] = useState('');

  const { articles } = useQQBrowserStore(
    useShallow((st) => ({
      articles: st.articles,
    })),
  );
  const toggleArticleBookmark = useQQBrowserStore((st) => st.toggleArticleBookmark);
  const toggleArticleLike = useQQBrowserStore((st) => st.toggleArticleLike);
  const addArticleComment = useQQBrowserStore((st) => st.addArticleComment);

  const article = articles.find((a) => a.id === id) || articles[0];

  return (
    <div
      className="flex flex-col h-full bg-white pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Bar */}
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-gray-100">
        <div
          {...bindBack()}
          className="w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-100 cursor-pointer"
        >
          <IcNavBack size={22} className="text-[#11192D]" />
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-[#11192D] truncate max-w-[220px]">
          <IcGlobe size={15} className="text-[#0066FF] flex-shrink-0" />
          <span className="truncate">{article.source}</span>
        </div>
        <div
          {...bindTap(
            { kind: 'action', id: 'article.bookmark.toggle' },
            {
              params: { articleId: article.id, to: !article.bookmarked },
              onTrigger: () => toggleArticleBookmark(article.id),
            },
          )}
          className="w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-100 cursor-pointer"
        >
          <IcBookmark
            size={19}
            className={article.bookmarked ? 'text-[#0066FF]' : 'text-[#11192D]'}
            fill={article.bookmarked ? 'currentColor' : 'none'}
          />
        </div>
      </div>

      {/* Main Article Scroll */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4"
        data-scroll-container="article-detail"
        data-scroll-direction="vertical"
      >
        <h1 className="text-[19px] font-bold text-[#11192D] leading-snug">{article.title}</h1>

        <div className="flex items-center justify-between text-xs text-[#8A94A6] pb-3 border-b border-gray-100">
          <span>
            {article.source} · {article.timeText}
          </span>
          <span>{article.readCountText}</span>
        </div>

        {/* AI Summary Box */}
        <div className="rounded-xl bg-[#F0F5FF] p-3 space-y-1 border border-[#D5E3FF]">
          <div className="text-xs font-bold text-[#0066FF]">QBot 智能网页摘要</div>
          <p className="text-xs text-[#11192D] leading-relaxed">{article.summary}</p>
        </div>

        {/* Paragraphs */}
        <div className="space-y-3 text-[15px] text-[#11192D] leading-relaxed">
          {article.content.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Like & Bookmark Actions */}
        <div className="py-3 flex items-center justify-center gap-4">
          <div
            {...bindTap(
              { kind: 'action', id: 'article.like.toggle' },
              {
                params: { articleId: article.id, to: !article.liked },
                onTrigger: () => toggleArticleLike(article.id),
              },
            )}
            className={`px-5 py-2 rounded-full border flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              article.liked
                ? 'border-[#FF3B30] bg-[#FFF0EF] text-[#FF3B30]'
                : 'border-gray-200 text-[#50607A]'
            }`}
          >
            <IcHeart size={15} fill={article.liked ? 'currentColor' : 'none'} />
            <span>
              {article.liked ? s.article_liked : s.article_like} ({article.likes})
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pt-3 border-t border-gray-100 space-y-2.5">
          <div className="text-sm font-bold text-[#11192D]">
            热门评论 ({article.comments.length})
          </div>
          {article.comments.map((c) => (
            <div key={c.id} className="bg-[#F5F7FA] rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#11192D]">{c.user}</span>
                <span className="text-[#8A94A6]">{c.timeText}</span>
              </div>
              <p className="text-xs text-[#50607A] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Comment Input */}
      <div className="bg-white border-t border-gray-100 px-3 py-2 flex items-center gap-2">
        <input
          type="text"
          value={commentText}
          data-action="article.comment.input.change"
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={s.article_comment_placeholder}
          className="flex-1 h-9 px-3 rounded-full bg-[#F5F7FA] text-xs text-[#11192D] outline-none"
        />
        <div
          {...bindTap(
            { kind: 'action', id: 'article.comment.submit' },
            {
              onTrigger: () => {
                if (commentText.trim()) {
                  addArticleComment(article.id, commentText);
                  setCommentText('');
                }
              },
            },
          )}
          className="h-8 px-4 rounded-full bg-[#0066FF] text-white text-xs font-semibold flex items-center justify-center cursor-pointer active:opacity-90"
        >
          {s.article_comment_send}
        </div>
      </div>
    </div>
  );
};
