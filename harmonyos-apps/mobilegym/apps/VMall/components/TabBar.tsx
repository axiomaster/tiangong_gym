import React from 'react';
import { useLocation } from 'react-router-dom';
import { useVMallGestures } from '../hooks/useVMallGestures';
import tabHomeIcon from '../assets/images/tab_home_icon.png';
import tabCategoryIcon from '../assets/images/tab_category_icon.png';
import tabDiscoverIcon from '../assets/images/tab_discover_icon.png';
import tabMeIcon from '../assets/images/tab_me_icon.png';

type TabTransitionId = 'tab.home' | 'tab.category' | 'tab.discover' | 'tab.me';

export const TabBar: React.FC = () => {
  const location = useLocation();
  const { bindTap, go } = useVMallGestures();

  const isActive = (path: string) => location.pathname === path;

  const handleTabClick = (path: string, transitionId: TabTransitionId) => {
    if (isActive(path)) return;
    go(transitionId);
  };

  const tabClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 flex-1 transition-all active:scale-95 cursor-pointer ${
      active ? 'text-[#C7000B]' : 'text-[#191919]'
    }`;
  const iconClass = (active: boolean) =>
    `w-5 h-5 object-contain transition-transform ${active ? 'scale-105' : 'opacity-85'}`;
  const labelClass = (active: boolean) =>
    `text-[10.5px] leading-tight ${active ? 'font-semibold text-[#C7000B]' : 'font-normal text-[#191919]'}`;

  return (
    <div
      className="absolute bottom-3 left-4 right-4 bg-white/85 backdrop-blur-2xl border border-white/70 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4 py-2 flex items-center justify-around z-30 select-none"
      data-floating-tabbar
    >
      <div
        {...bindTap<HTMLDivElement>('tab.home', { onTrigger: () => handleTabClick('/', 'tab.home') })}
        className={tabClass(isActive('/'))}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <img src={tabHomeIcon} alt="首页" className={iconClass(isActive('/'))} />
        </div>
        <span className={labelClass(isActive('/'))}>首页</span>
      </div>

      <div
        {...bindTap<HTMLDivElement>('tab.category', {
          onTrigger: () => handleTabClick('/category', 'tab.category'),
        })}
        className={tabClass(isActive('/category'))}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <img src={tabCategoryIcon} alt="分类" className={iconClass(isActive('/category'))} />
        </div>
        <span className={labelClass(isActive('/category'))}>分类</span>
      </div>

      <div
        {...bindTap<HTMLDivElement>('tab.discover', {
          onTrigger: () => handleTabClick('/discover', 'tab.discover'),
        })}
        className={tabClass(isActive('/discover'))}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <img src={tabDiscoverIcon} alt="发现" className={iconClass(isActive('/discover'))} />
        </div>
        <span className={labelClass(isActive('/discover'))}>发现</span>
      </div>

      <div
        {...bindTap<HTMLDivElement>('tab.me', { onTrigger: () => handleTabClick('/me', 'tab.me') })}
        className={tabClass(isActive('/me'))}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <img src={tabMeIcon} alt="我的" className={iconClass(isActive('/me'))} />
        </div>
        <span className={labelClass(isActive('/me'))}>我的</span>
      </div>
    </div>
  );
};

export default TabBar;
