import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useDouyinStrings } from '../hooks/useDouyinStrings';
import { useDouyinStore } from '../state';
import { DOUYIN_ASSETS } from '../data';
import { IcHeart, IcSettings } from '../res/icons';

export const MePage: React.FC = () => {
  const s = useDouyinStrings();
  const [activeSubTab, setActiveSubTab] = useState<'works' | 'liked' | 'saved'>('works');
  const { user, mainVideo, publishedCaptions } = useDouyinStore(
    useShallow((st) => ({
      user: st.user,
      mainVideo: st.mainVideo,
      publishedCaptions: st.publishedCaptions,
    })),
  );

  return (
    <div
      className="flex flex-col h-full bg-[#12121A] text-white pt-10"
      data-status-bar-foreground="light"
      data-navigation-bar-foreground="light"
    >
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        data-scroll-container="me-main"
        data-scroll-direction="vertical"
      >
        {/* Header Profile */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={DOUYIN_ASSETS.avatarAuthor}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-white/20 object-cover"
              />
              <div>
                <div className="text-[18px] font-bold">{user.name}</div>
                <div className="text-xs text-white/50 mt-0.5">抖音号：{user.douyinId}</div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-white/10 text-white/80">
              <IcSettings size={18} />
            </div>
          </div>

          <p className="text-xs text-white/80">{user.bio}</p>

          {/* Stats & Edit Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div>
                <span className="text-[15px] font-bold">{user.likesReceived}</span>
                <span className="text-xs text-white/60 ml-1">{s.me_likes_label}</span>
              </div>
              <div>
                <span className="text-[15px] font-bold">{user.followingCount}</span>
                <span className="text-xs text-white/60 ml-1">{s.me_following_label}</span>
              </div>
              <div>
                <span className="text-[15px] font-bold">{user.followersCount}</span>
                <span className="text-xs text-white/60 ml-1">{s.me_followers_label}</span>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-md bg-white/15 text-xs font-semibold">
              {s.me_edit_profile}
            </div>
          </div>
        </div>

        {/* Sub-tabs: 作品 / 喜欢 / 收藏 */}
        <div className="grid grid-cols-3 border-b border-white/10 text-center">
          {(
            [
              { id: 'works', label: `${s.me_tab_works} ${publishedCaptions.length}` },
              { id: 'liked', label: `${s.me_tab_liked} ${mainVideo.liked ? 1 : 0}` },
              { id: 'saved', label: `${s.me_tab_saved} ${mainVideo.starred ? 1 : 0}` },
            ] as const
          ).map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`py-2.5 text-sm font-semibold cursor-pointer relative ${
                activeSubTab === t.id ? 'text-white' : 'text-white/50'
              }`}
            >
              {t.label}
              {activeSubTab === t.id && (
                <div className="absolute bottom-0 inset-x-8 h-[2px] bg-[#FACE15]" />
              )}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {publishedCaptions.map((cap, idx) => (
            <div key={`${cap}_${idx}`} className="relative aspect-[3/4] bg-black overflow-hidden">
              <img
                src={DOUYIN_ASSETS.videoMain}
                alt={cap}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[11px] font-semibold text-white drop-shadow">
                <IcHeart size={12} />
                <span>{mainVideo.likesCountText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
