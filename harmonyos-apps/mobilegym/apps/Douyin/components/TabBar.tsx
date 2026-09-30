import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDouyinGestures } from '../hooks/useDouyinGestures';
import { useDouyinStrings } from '../hooks/useDouyinStrings';
import { useDouyinStore } from '../state';
import { DOUYIN_ASSETS } from '../data';
import type { TransitionId } from '../navigation.declaration';

export const TabBar: React.FC = () => {
  const { bindTap, go } = useDouyinGestures();
  const location = useLocation();
  const currentPath = location.pathname;
  const s = useDouyinStrings();
  const unreadCount = useDouyinStore((st) =>
    st.messages.reduce((sum, m) => sum + m.unread, 0),
  );

  const handleTabClick = (path: string, transition: TransitionId) => {
    if (currentPath === path) return;
    go(transition);
  };

  return (
    <div className="bg-black border-t border-white/10 flex justify-around items-center h-[54px] pb-1 sticky bottom-0 z-50">
      <div
        {...bindTap<HTMLDivElement>('tab.home', {
          onTrigger: () => handleTabClick('/', 'tab.home'),
        })}
        className={`flex items-center justify-center flex-1 h-full cursor-pointer ${
          currentPath === '/' ? 'text-white font-bold' : 'text-white/60 font-medium'
        }`}
      >
        <span className="text-[16px]">{s.tab_home}</span>
      </div>

      <div
        {...bindTap<HTMLDivElement>('tab.friends', {
          onTrigger: () => handleTabClick('/friends', 'tab.friends'),
        })}
        className={`flex items-center justify-center flex-1 h-full cursor-pointer ${
          currentPath === '/friends' ? 'text-white font-bold' : 'text-white/60 font-medium'
        }`}
      >
        <span className="text-[16px]">{s.tab_friends}</span>
      </div>

      <div
        {...bindTap<HTMLDivElement>('tab.publish')}
        className="flex items-center justify-center flex-1 h-full cursor-pointer active:scale-95 transition-transform"
      >
        <img
          src={DOUYIN_ASSETS.tabPublish}
          alt="publish"
          className="w-12 h-9 object-contain"
        />
      </div>

      <div
        {...bindTap<HTMLDivElement>('tab.messages', {
          onTrigger: () => handleTabClick('/messages', 'tab.messages'),
        })}
        className={`relative flex items-center justify-center flex-1 h-full cursor-pointer ${
          currentPath === '/messages' ? 'text-white font-bold' : 'text-white/60 font-medium'
        }`}
      >
        <span className="text-[16px]">{s.tab_messages}</span>
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-4 min-w-[15px] h-[15px] px-1 rounded-full bg-[#FE2C55] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      <div
        {...bindTap<HTMLDivElement>('tab.me', {
          onTrigger: () => handleTabClick('/me', 'tab.me'),
        })}
        className={`flex items-center justify-center flex-1 h-full cursor-pointer ${
          currentPath === '/me' ? 'text-white font-bold' : 'text-white/60 font-medium'
        }`}
      >
        <span className="text-[16px]">{s.tab_me}</span>
      </div>
    </div>
  );
};

export default TabBar;
