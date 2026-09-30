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
import { BaiduNetdiskNavigationHandler } from './components/BaiduNetdiskNavigationHandler';
import { TabBar } from './components/TabBar';
import { HomePage } from './pages/HomePage';
import { FilesPage } from './pages/FilesPage';
import { KukuAiPage } from './pages/KukuAiPage';
import { SharePage } from './pages/SharePage';
import { MePage } from './pages/MePage';
import { FileDetailPage } from './pages/FileDetailPage';
import { SearchPage } from './pages/SearchPage';

const Layout = () => {
  const { pathname } = useLocation();
  const isMainTab = ['/', '/files', '/ai', '/share', '/me'].includes(pathname);

  return (
    <div className="flex flex-col h-full bg-[#F4F7FC] select-none">
      <div className="flex-1 overflow-hidden relative">
        <div
          style={{ display: pathname === '/' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <HomePage />
        </div>
        <div
          style={{ display: pathname === '/files' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <FilesPage />
        </div>
        <div
          style={{ display: pathname === '/ai' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <KukuAiPage />
        </div>
        <div
          style={{ display: pathname === '/share' ? 'block' : 'none' }}
          className="h-full overflow-hidden"
        >
          <SharePage />
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

export const BaiduNetdiskApp: React.FC = () => {
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
        <BaiduNetdiskNavigationHandler />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div />} />
            <Route path="files" element={<div />} />
            <Route path="ai" element={<div />} />
            <Route path="share" element={<div />} />
            <Route path="me" element={<div />} />
            <Route path="file/:id" element={<FileDetailPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </div>
  );
};

export default BaiduNetdiskApp;
