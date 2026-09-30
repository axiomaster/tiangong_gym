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
import { DouyinNavigationHandler } from './components/DouyinNavigationHandler';
import { TabBar } from './components/TabBar';
import { HomePage } from './pages/HomePage';
import { FriendsPage } from './pages/FriendsPage';
import { PublishPage } from './pages/PublishPage';
import { MessagesPage } from './pages/MessagesPage';
import { MePage } from './pages/MePage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { SearchPage } from './pages/SearchPage';

const Layout = () => {
  const { pathname } = useLocation();
  const isMainTab = ['/', '/friends', '/messages', '/me'].includes(pathname);

  return (
    <div className="flex flex-col h-full bg-black select-none">
      <div className="flex-1 overflow-hidden relative">
        <div
          style={{ display: pathname === '/' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <HomePage />
        </div>
        <div
          style={{ display: pathname === '/friends' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <FriendsPage />
        </div>
        <div
          style={{ display: pathname === '/messages' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <MessagesPage />
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

export const DouyinApp: React.FC = () => {
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
        <DouyinNavigationHandler />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div />} />
            <Route path="friends" element={<div />} />
            <Route path="messages" element={<div />} />
            <Route path="me" element={<div />} />
            <Route path="publish" element={<PublishPage />} />
            <Route path="creator/:id" element={<CreatorProfilePage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </div>
  );
};

export default DouyinApp;
