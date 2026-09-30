import React from 'react';
import { useDouyinStrings } from '../hooks/useDouyinStrings';
import { useDouyinGestures } from '../hooks/useDouyinGestures';
import { useDouyinStore } from '../state';
import { DOUYIN_ASSETS } from '../data';
import { IcNavBack, IcHeart } from '../res/icons';

export const CreatorProfilePage: React.FC = () => {
  const s = useDouyinStrings();
  const { bindTap, bindBack } = useDouyinGestures();
  const mainVideo = useDouyinStore((st) => st.mainVideo);
  const toggleFollowAuthor = useDouyinStore((st) => st.toggleFollowAuthor);

  return (
    <div
      className="flex flex-col h-full bg-[#12121A] text-white pt-10"
      data-status-bar-foreground="light"
      data-navigation-bar-foreground="light"
    >
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-white/10">
        <div {...bindBack()} className="p-1 cursor-pointer text-white">
          <IcNavBack size={22} />
        </div>
        <span className="text-[16px] font-bold">{mainVideo.authorName}</span>
        <div className="w-6" />
      </div>

      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        data-scroll-container="creator-main"
        data-scroll-direction="vertical"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={DOUYIN_ASSETS.avatarAuthor}
              alt={mainVideo.authorName}
              className="w-20 h-20 rounded-full border-2 border-white/20 object-cover"
            />
            <div className="flex-1 space-y-2">
              <div className="text-lg font-bold">{mainVideo.authorName}</div>
              <div className="text-xs text-white/50">抖音号：nanmen_boss88</div>
              <div
                {...bindTap(
                  { kind: 'action', id: 'creator.follow.toggle' },
                  {
                    params: { to: !mainVideo.followedAuthor },
                    onTrigger: () => toggleFollowAuthor(),
                  },
                )}
                className={`w-full py-2 rounded-md text-xs font-bold text-center cursor-pointer ${
                  mainVideo.followedAuthor
                    ? 'bg-white/15 text-white/85'
                    : 'bg-[#FE2C55] text-white'
                }`}
              >
                {mainVideo.followedAuthor ? s.creator_followed : s.creator_follow}
              </div>
            </div>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            实体男装店十年老店 · 每天分享真实穿搭与店铺日常
          </p>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-sm font-bold text-white">186.4万</span>{' '}
              <span className="text-white/55">{s.me_likes_label}</span>
            </div>
            <div>
              <span className="text-sm font-bold text-white">128</span>{' '}
              <span className="text-white/55">{s.me_following_label}</span>
            </div>
            <div>
              <span className="text-sm font-bold text-white">24.5万</span>{' '}
              <span className="text-white/55">{s.me_followers_label}</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-white/10 text-sm font-bold text-white">
          {s.me_tab_works} 18
        </div>

        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="relative aspect-[3/4] bg-black overflow-hidden">
              <img
                src={DOUYIN_ASSETS.videoMain}
                alt={mainVideo.captionShort}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[11px] font-semibold text-white">
                <IcHeart size={12} />
                <span>{idx === 1 ? mainVideo.likesCountText : `${idx * 2.1}万`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
