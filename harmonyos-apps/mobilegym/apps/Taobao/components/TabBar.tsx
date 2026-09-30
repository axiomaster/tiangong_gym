import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTaobaoGestures } from '../hooks/useTaobaoGestures';
import { useTaobaoStrings } from '../hooks/useTaobaoStrings';
import { TAOBAO_ASSETS } from '../data';
import type { TransitionId } from '../navigation.declaration';

export const TabBar: React.FC = () => {
  const { bindTap, go } = useTaobaoGestures();
  const location = useLocation();
  const currentPath = location.pathname;
  const s = useTaobaoStrings();

  const tabs: Array<{
    id: string;
    label: string;
    path: string;
    imgSrc: string;
    transition: TransitionId;
  }> = [
    {
      id: 'home',
      label: s.tab_home,
      path: '/',
      imgSrc: TAOBAO_ASSETS.tabHomeActive,
      transition: 'tab.home',
    },
    {
      id: 'video',
      label: s.tab_video,
      path: '/video',
      imgSrc: TAOBAO_ASSETS.tabVideo,
      transition: 'tab.video',
    },
    {
      id: 'messages',
      label: s.tab_message,
      path: '/messages',
      imgSrc: TAOBAO_ASSETS.tabMessage,
      transition: 'tab.messages',
    },
    {
      id: 'cart',
      label: s.tab_cart,
      path: '/cart',
      imgSrc: TAOBAO_ASSETS.tabCart,
      transition: 'tab.cart',
    },
    {
      id: 'me',
      label: s.tab_me,
      path: '/me',
      imgSrc: TAOBAO_ASSETS.tabMe,
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
        if (tab.id === 'home' && isActive) {
          return (
            <div
              key={tab.id}
              {...bindTap<HTMLDivElement>(tab.transition, {
                onTrigger: () => handleTabClick(tab.path, tab.transition),
              })}
              className="flex flex-col items-center justify-center flex-1 h-full cursor-pointer active:scale-95 transition-transform"
            >
              <img
                src={tab.imgSrc}
                alt={tab.label}
                className="w-10 h-11 object-contain"
              />
            </div>
          );
        }
        return (
          <div
            key={tab.id}
            {...bindTap<HTMLDivElement>(tab.transition, {
              onTrigger: () => handleTabClick(tab.path, tab.transition),
            })}
            className="flex flex-col items-center justify-center flex-1 h-full cursor-pointer active:scale-95 transition-transform"
          >
            <img
              src={tab.imgSrc}
              alt={tab.label}
              className="w-7 h-7 object-contain"
            />
            <span
              className={`text-[10px] font-medium -mt-0.5 ${
                isActive ? 'text-[#FF5000] font-bold' : 'text-[#11192D]'
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
