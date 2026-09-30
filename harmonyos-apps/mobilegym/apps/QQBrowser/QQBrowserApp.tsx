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
import { QQBrowserNavigationHandler } from './components/QQBrowserNavigationHandler';
import { TabBar } from './components/TabBar';
import { HomePage } from './pages/HomePage';
import { FeedPage } from './pages/FeedPage';
import { NovelPage } from './pages/NovelPage';
import { FilesPage } from './pages/FilesPage';
import { MePage } from './pages/MePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { SearchPage } from './pages/SearchPage';

const Layout = () => {
  const { pathname } = useLocation();
  const isMainTab = ['/', '/feed', '/novel', '/files', '/me'].includes(pathname);

  return (
    <div className="flex flex-col h-full bg-white select-none">
      <div className="flex-1 overflow-hidden relative">
        <div
          style={{ display: pathname === '/' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <HomePage />
        </div>
        <div
          style={{ display: pathname === '/feed' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <FeedPage />
        </div>
        <div
          style={{ display: pathname === '/novel' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <NovelPage />
        </div>
        <div
          style={{ display: pathname === '/files' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <FilesPage />
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

export const QQBrowserApp: React.FC = () => {
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
        <QQBrowserNavigationHandler />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div />} />
            <Route path="feed" element={<div />} />
            <Route path="novel" element={<div />} />
            <Route path="files" element={<div />} />
            <Route path="me" element={<div />} />
            <Route path="article/:id" element={<ArticleDetailPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </div>
  );
};

export default QQBrowserApp;
