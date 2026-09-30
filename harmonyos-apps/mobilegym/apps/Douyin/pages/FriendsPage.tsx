import React from 'react';
import { useDouyinStrings } from '../hooks/useDouyinStrings';
import { useDouyinGestures } from '../hooks/useDouyinGestures';
import { useDouyinStore } from '../state';
import { DOUYIN_ASSETS } from '../data';

export const FriendsPage: React.FC = () => {
  const s = useDouyinStrings();
  const { bindTap } = useDouyinGestures();
  const friends = useDouyinStore((st) => st.friends);
  const toggleFriendFollow = useDouyinStore((st) => st.toggleFriendFollow);

  return (
    <div
      className="flex flex-col h-full bg-[#12121A] text-white pt-10"
      data-status-bar-foreground="light"
      data-navigation-bar-foreground="light"
    >
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <span className="text-[17px] font-bold">{s.friends_title}</span>
      </div>

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3"
        data-scroll-container="friends-list"
        data-scroll-direction="vertical"
      >
        {friends.map((fr) => (
          <div
            key={fr.id}
            className="bg-[#1C1C28] rounded-xl p-3.5 flex items-center justify-between gap-3 border border-white/5"
          >
            <div
              {...bindTap('home.creator.open', { params: { id: 'creator_nanmen' } })}
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
            >
              <img
                src={DOUYIN_ASSETS.avatarAuthor}
                alt={fr.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-white truncate">{fr.name}</div>
                <div className="text-xs text-white/60 truncate mt-0.5">{fr.bio}</div>
                <div className="text-[11px] text-[#25F4EE] truncate mt-1">{fr.statusText}</div>
              </div>
            </div>

            <div
              {...bindTap(
                { kind: 'action', id: 'friends.item.follow.toggle' },
                {
                  params: { friendId: fr.id, to: !fr.mutual },
                  onTrigger: () => toggleFriendFollow(fr.id),
                },
              )}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer flex-shrink-0 ${
                fr.mutual
                  ? 'bg-white/15 text-white/80'
                  : 'bg-[#FE2C55] text-white'
              }`}
            >
              {fr.mutual ? s.friends_followed_btn : s.friends_follow_btn}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
