import React from 'react';
import { MemoryRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { dimensToCssVars, themeToCssVars } from '../../os/utils/themeToCssVars';
import { applySkinToThemeColors } from '../../os/SkinService';
import { useDarkMode } from '../../os/hooks/useDarkMode';
import { manifest } from './manifest';
import { colors, colorsDark } from './res/colors';
import { colorStates, colorStatesDark } from './res/colors.states';
import { anim } from './res/anim';
import { dimens } from './res/dimens';
import { MeituanNavigationHandler } from './components/MeituanNavigationHandler';
import { TabBar } from './components/TabBar';
import { HomePage } from './pages/HomePage';
import { VideoPage } from './pages/VideoPage';
import { XiaotuanPage } from './pages/XiaotuanPage';
import { CartPage } from './pages/CartPage';
import { MePage } from './pages/MePage';
import { DealDetailPage } from './pages/DealDetailPage';
import { SearchPage } from './pages/SearchPage';

const Layout = () => {
  const { pathname } = useLocation();
  const isMainTab = ['/', '/video', '/xiaotuan', '/cart', '/me'].includes(pathname);

  return (
    <div className="flex flex-col h-full bg-[#F4F4F6] select-none">
      <div className="flex-1 overflow-hidden relative">
        <div
          style={{ display: pathname === '/' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <HomePage />
        </div>
        <div
          style={{ display: pathname === '/video' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <VideoPage />
        </div>
        <div
          style={{ display: pathname === '/xiaotuan' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <XiaotuanPage />
        </div>
        <div
          style={{ display: pathname === '/cart' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <CartPage />
        </div>
        <div
          style={{ display: pathname === '/me' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <MePage />
        </div>

        {!isMainTab && <Outlet />}
      </div>

      {isMainTab && <TabBar />}
    </div>
  );
};

export const MeituanApp: React.FC = () => {
  const { isDark } = useDarkMode();
  const themeColors = isDark
    ? { ...manifest.theme.colors, ...(manifest.theme.colorsDark ?? {}) }
    : manifest.theme.colors;
  const appColors = isDark ? { ...colors, ...colorsDark } : colors;
  const appColorStates = isDark ? { ...colorStates, ...colorStatesDark } : colorStates;
  const cssVars = {
    ...themeToCssVars(applySkinToThemeColors(themeColors)),
    ...dimensToCssVars(appColors, { prefix: '--app-c-' }),
    ...dimensToCssVars(appColorStates, { prefix: '--app-cs-' }),
    ...dimensToCssVars(dimens),
    ...dimensToCssVars(anim, { prefix: '--app-' }),
  };

  return (
    <div className="h-full w-full" style={cssVars as React.CSSProperties}>
      <MemoryRouter initialEntries={['/']}>
        <MeituanNavigationHandler />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div />} />
            <Route path="video" element={<div />} />
            <Route path="xiaotuan" element={<div />} />
            <Route path="cart" element={<div />} />
            <Route path="me" element={<div />} />
            <Route path="deal/:id" element={<DealDetailPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </div>
  );
};

export default MeituanApp;
