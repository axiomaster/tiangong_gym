import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePinduoduoGestures } from '../hooks/usePinduoduoGestures';
import { usePinduoduoStrings } from '../hooks/usePinduoduoStrings';
import { PINDUODUO_ASSETS } from '../data';
import type { TransitionId } from '../navigation.declaration';

export const TabBar: React.FC = () => {
  const { bindTap, go } = usePinduoduoGestures();
  const location = useLocation();
  const currentPath = location.pathname;
  const s = usePinduoduoStrings();

  const tabs: Array<{
    id: string;
    label: string;
    path: string;
    imgSrc: string;
    transition: TransitionId;
    badge?: string;
  }> = [
    {
      id: 'home',
      label: s.tab_home,
      path: '/',
      imgSrc: PINDUODUO_ASSETS.tabHome,
      transition: 'tab.home',
    },
    {
      id: 'video',
      label: s.tab_video,
      path: '/video',
      imgSrc: PINDUODUO_ASSETS.tabVideo,
      transition: 'tab.video',
      badge: '2',
    },
    {
      id: 'promo',
      label: s.tab_promo,
      path: '/promo',
      imgSrc: PINDUODUO_ASSETS.tabPromo,
      transition: 'tab.promo',
    },
    {
      id: 'chat',
      label: s.tab_chat,
      path: '/chat',
      imgSrc: PINDUODUO_ASSETS.tabChat,
      transition: 'tab.chat',
    },
    {
      id: 'me',
      label: s.tab_me,
      path: '/me',
      imgSrc: PINDUODUO_ASSETS.tabMe,
      transition: 'tab.me',
    },
  ];

  const handleTabClick = (path: string, transition: TransitionId) => {
    if (currentPath === path) return;
    go(transition);
  };

  return (
    <div className="bg-white border-t border-gray-100 flex justify-around items-center h-[58px] pb-1 sticky bottom-0 z-50">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        return (
          <div
            key={tab.id}
            {...bindTap<HTMLDivElement>(tab.transition, {
              onTrigger: () => handleTabClick(tab.path, tab.transition),
            })}
            className="relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer active:scale-95 transition-transform"
          >
            <div className="relative">
              <img
                src={tab.imgSrc}
                alt={tab.label}
                className={tab.id === 'promo' ? 'w-8 h-8 object-contain' : 'w-6 h-6 object-contain'}
              />
              {tab.badge && (
                <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 rounded-full bg-[#E02E24] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-medium mt-0.5 ${
                isActive ? 'text-[#E02E24] font-bold' : 'text-[#58595B]'
              }`}
            >
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TabBar;
