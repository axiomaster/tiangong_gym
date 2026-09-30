import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useDouyinStrings } from '../hooks/useDouyinStrings';
import { useDouyinGestures } from '../hooks/useDouyinGestures';
import { useDouyinStore } from '../state';
import { DOUYIN_ASSETS } from '../data';
import { IcCheck, IcClose, IcHeart, IcStar, IcSend } from '../res/icons';

export const HomePage: React.FC = () => {
  const s = useDouyinStrings();
  const { bindTap } = useDouyinGestures();
  const [searchParams] = useSearchParams();
  const activeTopTab = searchParams.get('tab') || 'recommend';
  const showCommentsSheet = searchParams.get('sheet') === 'comments';
  const [commentInput, setCommentInput] = useState('');

  const { mainVideo, captionExpanded, fullscreenMode } = useDouyinStore(
    useShallow((st) => ({
      mainVideo: st.mainVideo,
      captionExpanded: st.captionExpanded,
      fullscreenMode: st.fullscreenMode,
    })),
  );
  const toggleVideoLike = useDouyinStore((st) => st.toggleVideoLike);
  const toggleVideoStar = useDouyinStore((st) => st.toggleVideoStar);
  const toggleFollowAuthor = useDouyinStore((st) => st.toggleFollowAuthor);
  const toggleCaptionExpanded = useDouyinStore((st) => st.toggleCaptionExpanded);
  const toggleFullscreenMode = useDouyinStore((st) => st.toggleFullscreenMode);
  const addComment = useDouyinStore((st) => st.addComment);
  const toggleCommentLike = useDouyinStore((st) => st.toggleCommentLike);

  const topTabs = [
    { id: 'hot', label: s.top_hot },
    { id: 'follow', label: s.top_follow, hasLiveBadge: true },
    { id: 'groupbuy', label: s.top_groupbuy },
    { id: 'city', label: s.top_city },
    { id: 'mall', label: s.top_mall },
    { id: 'recommend', label: s.top_recommend },
  ];

  return (
    <div
      className="relative flex flex-col h-full w-full bg-black text-white overflow-hidden pt-10"
      data-status-bar-foreground="light"
      data-navigation-bar-foreground="light"
    >
      {/* Top Bar */}
      {!fullscreenMode && (
        <div className="relative z-20 flex items-center justify-between px-3 py-1.5">
          {/* Left Menu with 18 badge */}
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            <img
              src={DOUYIN_ASSETS.topMenu}
              alt="menu"
              className="w-8 h-8 object-contain"
            />
          </div>

          {/* Center Channel Tabs */}
          <div className="flex items-center gap-3.5">
            {topTabs.map((t) => {
              const isActive = activeTopTab === t.id;
              return (
                <div
                  key={t.id}
                  {...bindTap('home.topTab.switch', { params: { tab: t.id } })}
                  className={`relative py-1 cursor-pointer transition-colors ${
                    isActive
                      ? 'text-[16px] font-bold text-white'
                      : 'text-[15px] font-medium text-white/65'
                  }`}
                >
                  <span>{t.label}</span>
                  {t.hasLiveBadge && (
                    <span className="absolute -top-1.5 -right-3.5 bg-gradient-to-r from-[#FF1764] to-[#ED3495] text-white text-[8px] font-bold px-1 py-[1px] rounded-full leading-none">
                      {s.top_live_badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2.5px] rounded-full bg-white" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Search Icon */}
          <div
            {...bindTap('home.search.open')}
            className="w-9 h-9 flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-95"
          >
            <img
              src={DOUYIN_ASSETS.topSearch}
              alt="search"
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>
      )}

      {/* Floating Top-Left Red Packet Widget */}
      {!fullscreenMode && (
        <div className="absolute top-[86px] left-2.5 z-20 pointer-events-none">
          <img
            src={DOUYIN_ASSETS.redPacket}
            alt="red-packet"
            className="w-[52px] h-[72px] object-contain"
          />
        </div>
      )}

      {/* Main Video Canvas Area */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center overflow-hidden"
        data-scroll-container="video-feed"
        data-scroll-direction="vertical"
      >
        <div
          className={`w-full transition-all duration-200 ${
            fullscreenMode ? 'h-full' : 'mt-[-24px]'
          } flex flex-col items-center justify-center`}
        >
          <img
            src={DOUYIN_ASSETS.videoMain}
            alt={mainVideo.authorName}
            className={`w-full ${
              fullscreenMode ? 'h-full object-contain' : 'aspect-[16/10] object-cover'
            }`}
          />

          {/* 全屏观看 Pill Button */}
          <div
            {...bindTap(
              { kind: 'action', id: 'home.fullscreen.mode.toggle' },
              {
                params: { to: !fullscreenMode },
                onTrigger: () => toggleFullscreenMode(),
              },
            )}
            className="mt-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1C1C24]/90 border border-white/15 text-white/90 text-[12px] font-medium cursor-pointer active:scale-95 transition-transform"
          >
            <img
              src={DOUYIN_ASSETS.icFullscreen}
              alt="fullscreen"
              className="w-4 h-4 object-contain"
            />
            <span>{fullscreenMode ? s.exit_fullscreen : s.fullscreen_watch}</span>
          </div>
        </div>

        {/* Right Vertical Interaction Rail */}
        {!fullscreenMode && (
          <div className="absolute right-2.5 bottom-4 z-20 flex flex-col items-center gap-4">
            {/* Creator Avatar + Follow Plus */}
            <div className="relative mb-2">
              <div
                {...bindTap('home.creator.open', { params: { id: mainVideo.authorId } })}
                className="w-12 h-12 rounded-full border-[1.5px] border-white overflow-hidden cursor-pointer"
              >
                <img
                  src={DOUYIN_ASSETS.avatarAuthor}
                  alt={mainVideo.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                {...bindTap(
                  { kind: 'action', id: 'home.author.follow.toggle' },
                  {
                    params: { to: !mainVideo.followedAuthor },
                    onTrigger: () => toggleFollowAuthor(),
                  },
                )}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 cursor-pointer active:scale-90 transition-transform"
              >
                {mainVideo.followedAuthor ? (
                  <div className="w-5 h-5 rounded-full bg-white text-[#FE2C55] flex items-center justify-center shadow-xs">
                    <IcCheck size={12} strokeWidth={3} />
                  </div>
                ) : (
                  <img
                    src={DOUYIN_ASSETS.icFollowPlus}
                    alt="follow"
                    className="w-6 h-6 object-contain"
                  />
                )}
              </div>
            </div>

            {/* Like Button */}
            <div
              {...bindTap(
                { kind: 'action', id: 'home.video.like.toggle' },
                {
                  params: { to: !mainVideo.liked },
                  onTrigger: () => toggleVideoLike(),
                },
              )}
              className="flex flex-col items-center cursor-pointer active:scale-90 transition-transform"
            >
              {mainVideo.liked ? (
                <IcHeart size={34} className="text-[#FE2C55]" fill="currentColor" />
              ) : (
                <img
                  src={DOUYIN_ASSETS.icLike}
                  alt="like"
                  className="w-9 h-9 object-contain"
                />
              )}
              <span className="text-[12px] font-medium text-white/90 mt-0.5">
                {mainVideo.likesCountText}
              </span>
            </div>

            {/* Comment Button */}
            <div
              {...bindTap('home.comments.open')}
              className="flex flex-col items-center cursor-pointer active:scale-90 transition-transform"
            >
              <img
                src={DOUYIN_ASSETS.icComment}
                alt="comment"
                className="w-9 h-9 object-contain"
              />
              <span className="text-[12px] font-medium text-white/90 mt-0.5">
                {mainVideo.commentsCount}
              </span>
            </div>

            {/* Star / Favorite Button */}
            <div
              {...bindTap(
                { kind: 'action', id: 'home.video.star.toggle' },
                {
                  params: { to: !mainVideo.starred },
                  onTrigger: () => toggleVideoStar(),
                },
              )}
              className="flex flex-col items-center cursor-pointer active:scale-90 transition-transform"
            >
              {mainVideo.starred ? (
                <IcStar size={34} className="text-[#FACE15]" fill="currentColor" />
              ) : (
                <img
                  src={DOUYIN_ASSETS.icStar}
                  alt="star"
                  className="w-9 h-9 object-contain"
                />
              )}
              <span className="text-[12px] font-medium text-white/90 mt-0.5">
                {mainVideo.starsCount}
              </span>
            </div>

            {/* Share Button */}
            <div
              {...bindTap('home.creator.open', { params: { id: mainVideo.authorId } })}
              className="flex flex-col items-center cursor-pointer active:scale-90 transition-transform"
            >
              <img
                src={DOUYIN_ASSETS.icShare}
                alt="share"
                className="w-9 h-9 object-contain"
              />
              <span className="text-[12px] font-medium text-white/90 mt-0.5">
                {mainVideo.sharesCountText}
              </span>
            </div>

            {/* Music Vinyl Disc */}
            <div className="mt-1 w-11 h-11 rounded-full overflow-hidden">
              <img
                src={DOUYIN_ASSETS.musicDisc}
                alt="music"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Bottom-Left Author & Caption Overlay */}
        {!fullscreenMode && (
          <div className="absolute left-3 bottom-3.5 right-16 z-20 space-y-1.5">
            <div
              {...bindTap('home.creator.open', { params: { id: mainVideo.authorId } })}
              className="text-[16px] font-bold text-white cursor-pointer w-fit"
            >
              {mainVideo.authorHandle}
            </div>
            <div className="text-[14px] text-white/90 leading-snug">
              <span>{captionExpanded ? mainVideo.captionFull : mainVideo.captionShort}</span>
              <span
                {...bindTap(
                  { kind: 'action', id: 'home.caption.expand.toggle' },
                  {
                    params: { to: !captionExpanded },
                    onTrigger: () => toggleCaptionExpanded(),
                  },
                )}
                className="ml-1.5 font-semibold text-white/80 cursor-pointer"
              >
                {captionExpanded ? s.caption_collapse : s.caption_expand}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Comments Bottom Sheet (?sheet=comments) */}
      {showCommentsSheet && (
        <div className="absolute inset-x-0 bottom-0 h-[66%] bg-[#181820] rounded-t-2xl z-40 flex flex-col border-t border-white/10">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
            <span className="text-sm font-bold text-white">
              {mainVideo.commentsCount}
              {s.comments_title}
            </span>
            <div
              {...bindTap('home.comments.close')}
              className="p-1 text-white/70 cursor-pointer"
            >
              <IcClose size={18} />
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4"
            data-scroll-container="comments-list"
            data-scroll-direction="vertical"
          >
            {mainVideo.comments.map((cmt) => (
              <div key={cmt.id} className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white/65">{cmt.user}</div>
                  <p className="text-sm text-white/95 mt-1 leading-snug">{cmt.content}</p>
                  <div className="text-[11px] text-white/45 mt-1">{cmt.timeText}</div>
                </div>
                <div
                  {...bindTap(
                    { kind: 'action', id: 'home.comment.like.toggle' },
                    {
                      params: { commentId: cmt.id, to: !cmt.liked },
                      onTrigger: () => toggleCommentLike(cmt.id),
                    },
                  )}
                  className="flex flex-col items-center text-white/60 cursor-pointer"
                >
                  <IcHeart
                    size={16}
                    className={cmt.liked ? 'text-[#FE2C55]' : 'text-white/60'}
                    fill={cmt.liked ? 'currentColor' : 'none'}
                  />
                  <span className="text-[11px] mt-0.5">{cmt.likes}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#121218]">
            <input
              type="text"
              value={commentInput}
              data-action="home.comment.input.change"
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={s.comment_placeholder}
              className="flex-1 bg-white/10 rounded-full px-3.5 py-2 text-xs text-white placeholder-white/40 outline-none"
            />
            <div
              {...bindTap(
                { kind: 'action', id: 'home.comment.submit' },
                {
                  onTrigger: () => {
                    addComment(commentInput);
                    setCommentInput('');
                  },
                },
              )}
              className="px-3.5 py-2 rounded-full bg-[#FE2C55] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <IcSend size={13} />
              <span>{s.comment_send}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
