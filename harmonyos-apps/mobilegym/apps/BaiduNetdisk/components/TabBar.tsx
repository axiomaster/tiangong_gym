import React from 'react';
import { useLocation } from 'react-router-dom';
import { useBaiduNetdiskGestures } from '../hooks/useBaiduNetdiskGestures';
import { useBaiduNetdiskStrings } from '../hooks/useBaiduNetdiskStrings';
import { BAIDU_NETDISK_ASSETS } from '../data';
import type { TransitionId } from '../navigation.declaration';

export const TabBar: React.FC = () => {
  const { bindTap, go } = useBaiduNetdiskGestures();
  const location = useLocation();
  const currentPath = location.pathname;
  const s = useBaiduNetdiskStrings();

  const tabs: Array<{
    id: string;
    label: string;
    path: string;
    imgSrc: string;
    transition: TransitionId;
    isCenterAi?: boolean;
  }> = [
    {
      id: 'home',
      label: s.tab_home,
      path: '/',
      imgSrc: BAIDU_NETDISK_ASSETS.tabHome,
      transition: 'tab.home',
    },
    {
      id: 'files',
      label: s.tab_files,
      path: '/files',
      imgSrc: BAIDU_NETDISK_ASSETS.tabFiles,
      transition: 'tab.files',
    },
    {
      id: 'ai',
      label: s.tab_kuku_ai,
      path: '/ai',
      imgSrc: BAIDU_NETDISK_ASSETS.tabKukuAi,
      transition: 'tab.ai',
      isCenterAi: true,
    },
    {
      id: 'share',
      label: s.tab_share,
      path: '/share',
      imgSrc: BAIDU_NETDISK_ASSETS.tabShare,
      transition: 'tab.share',
    },
    {
      id: 'me',
      label: s.tab_me,
      path: '/me',
      imgSrc: BAIDU_NETDISK_ASSETS.tabMe,
      transition: 'tab.me',
    },
  ];

  const handleTabClick = (path: string, transition: TransitionId) => {
    if (currentPath === path) return;
    go(transition);
  };

  return (
    <div className="bg-white border-t border-gray-100 flex justify-around items-center h-[62px] pb-1 sticky bottom-0 z-50">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        if (tab.isCenterAi) {
          return (
            <div
              key={tab.id}
              {...bindTap<HTMLDivElement>(tab.transition, {
                onTrigger: () => handleTabClick(tab.path, tab.transition),
              })}
              className="flex flex-col items-center justify-end flex-1 h-full pb-1 cursor-pointer active:scale-95 transition-transform relative"
            >
              <div className="-mt-5 w-12 h-12 rounded-full bg-white p-0.5 shadow-sm flex items-center justify-center">
                <img
                  src={tab.imgSrc}
                  alt={tab.label}
                  className="w-11 h-11 object-contain"
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 ${
                  isActive ? 'text-[#06A7FF] font-bold' : 'text-[#8B919E] font-medium'
                }`}
              >
                {tab.label}
              </span>
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
              className={`w-6 h-6 object-contain ${isActive ? 'opacity-100' : 'opacity-75'}`}
            />
            <span
              className={`text-[10px] mt-1 ${
                isActive ? 'text-[#191C24] font-bold' : 'text-[#8B919E] font-medium'
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
