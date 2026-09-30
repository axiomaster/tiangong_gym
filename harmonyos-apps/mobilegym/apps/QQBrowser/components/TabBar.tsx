import React from 'react';
import { useLocation } from 'react-router-dom';
import { useQQBrowserGestures } from '../hooks/useQQBrowserGestures';
import { useQQBrowserStrings } from '../hooks/useQQBrowserStrings';
import { QQBROWSER_ASSETS } from '../data';
import type { TransitionId } from '../navigation.declaration';

export const TabBar: React.FC = () => {
  const { bindTap, go } = useQQBrowserGestures();
  const location = useLocation();
  const currentPath = location.pathname;
  const s = useQQBrowserStrings();

  const tabs: Array<{
    id: string;
    label: string;
    path: string;
    imgSrc: string;
    transition: TransitionId;
  }> = [
    {
      id: 'feed',
      label: s.tab_feed,
      path: '/feed',
      imgSrc: QQBROWSER_ASSETS.tabFeed,
      transition: 'tab.feed',
    },
    {
      id: 'novel',
      label: s.tab_novel,
      path: '/novel',
      imgSrc: QQBROWSER_ASSETS.tabNovel,
      transition: 'tab.novel',
    },
    {
      id: 'home',
      label: s.tab_home,
      path: '/',
      imgSrc: QQBROWSER_ASSETS.tabHome,
      transition: 'tab.home',
    },
    {
      id: 'files',
      label: s.tab_files,
      path: '/files',
      imgSrc: QQBROWSER_ASSETS.tabFiles,
      transition: 'tab.files',
    },
    {
      id: 'me',
      label: s.tab_me,
      path: '/me',
      imgSrc: QQBROWSER_ASSETS.tabMe,
      transition: 'tab.me',
    },
  ];

  const handleTabClick = (path: string, transition: TransitionId) => {
    if (currentPath === path) return;
    go(transition);
  };

  return (
    <div className="bg-white border-t border-gray-100/80 flex justify-around items-center h-[60px] pb-1 sticky bottom-0 z-50">
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
              className="w-[25px] h-[25px] object-contain"
            />
            <span
              className={`text-[11px] mt-1 leading-none ${
                isActive ? 'text-[#11192D] font-bold' : 'text-[#50607A] font-normal'
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
