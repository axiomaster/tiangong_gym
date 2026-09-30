import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMeituanGestures } from '../hooks/useMeituanGestures';
import { useMeituanStrings } from '../hooks/useMeituanStrings';
import { MEITUAN_ASSETS } from '../data';
import type { TransitionId } from '../navigation.declaration';

export const TabBar: React.FC = () => {
  const { bindTap, go } = useMeituanGestures();
  const location = useLocation();
  const currentPath = location.pathname;
  const s = useMeituanStrings();

  const tabs: Array<{
    id: string;
    label: string;
    path: string;
    imgSrc: string;
    transition: TransitionId;
    isCenter?: boolean;
  }> = [
    {
      id: 'home',
      label: s.tab_home,
      path: '/',
      imgSrc: MEITUAN_ASSETS.tabHomeActive,
      transition: 'tab.home',
    },
    {
      id: 'video',
      label: s.tab_video,
      path: '/video',
      imgSrc: MEITUAN_ASSETS.tabVideo,
      transition: 'tab.video',
    },
    {
      id: 'xiaotuan',
      label: s.tab_xiaotuan,
      path: '/xiaotuan',
      imgSrc: MEITUAN_ASSETS.tabXiaotuan,
      transition: 'tab.xiaotuan',
      isCenter: true,
    },
    {
      id: 'cart',
      label: s.tab_cart,
      path: '/cart',
      imgSrc: MEITUAN_ASSETS.tabCart,
      transition: 'tab.cart',
    },
    {
      id: 'me',
      label: s.tab_me,
      path: '/me',
      imgSrc: MEITUAN_ASSETS.tabMe,
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
            className="flex flex-col items-center justify-center flex-1 h-full cursor-pointer active:scale-95 transition-transform"
          >
            <img
              src={tab.imgSrc}
              alt={tab.label}
              className={
                tab.isCenter
                  ? 'w-9 h-9 -mt-2 object-contain'
                  : 'w-6 h-6 object-contain'
              }
            />
            <span
              className={`text-[10px] mt-0.5 ${
                isActive ? 'text-[#111111] font-bold' : 'text-[#50607A] font-medium'
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
