import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useQQBrowserStrings } from '../hooks/useQQBrowserStrings';
import { useQQBrowserGestures } from '../hooks/useQQBrowserGestures';
import { useQQBrowserStore } from '../state';
import { QQBROWSER_ASSETS } from '../data';
import type { TransitionId } from '../navigation.declaration';

export const HomePage: React.FC = () => {
  const s = useQQBrowserStrings();
  const { bindTap } = useQQBrowserGestures();

  const { qbotModeActive, user } = useQQBrowserStore(
    useShallow((st) => ({
      qbotModeActive: st.qbotModeActive,
      user: st.user,
    })),
  );
  const toggleQbotMode = useQQBrowserStore((st) => st.toggleQbotMode);

  const row1Shortcuts: Array<{
    id: string;
    label: string;
    col: number;
    transition: TransitionId;
    params?: Record<string, string | number>;
  }> = [
    { id: 'files', label: s.tool_files, col: 0, transition: 'tab.files' },
    { id: 'novel', label: s.tool_novel, col: 1, transition: 'tab.novel' },
    { id: 'video', label: s.tool_video, col: 2, transition: 'tab.feed' },
    {
      id: 'drama',
      label: s.tool_drama,
      col: 3,
      transition: 'home.article.open',
      params: { id: 'art_drama_hot' },
    },
    { id: 'bookmarks', label: s.tool_bookmarks, col: 4, transition: 'tab.me' },
  ];

  const row2Shortcuts: Array<{
    id: string;
    label: string;
    col: number;
    transition: TransitionId;
    params?: Record<string, string | number>;
  }> = [
    { id: 'scan', label: s.tool_scan, col: 0, transition: 'home.search.open' },
    { id: 'sogou', label: s.tool_sogou, col: 1, transition: 'home.search.open' },
    {
      id: 'deepseek',
      label: s.tool_deepseek,
      col: 2,
      transition: 'home.article.open',
      params: { id: 'art_deepseek_r1' },
    },
  ];

  return (
    <div
      className="flex flex-col h-full bg-white pt-10 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 12% 32%, #DEE8FF 0%, #EFF4FF 32%, #FFFFFF 68%)',
      }}
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Bar: Weather (29° 深圳) on Left, Multi-Tab Counter (1) on Right */}
      <div className="flex items-center justify-between px-3.5 pt-1 pb-2">
        <div
          {...bindTap('home.article.open', { params: { id: 'art_shenzhen_weather' } })}
          className="flex items-end cursor-pointer active:opacity-80"
        >
          <img
            src={QQBROWSER_ASSETS.weather29}
            alt={s.weather_temp}
            className="h-[46px] w-auto object-contain"
          />
          <span className="text-[13px] font-medium text-[#11192D] ml-0.5 mb-1.5">
            {s.weather_city}
          </span>
        </div>

        <div
          {...bindTap('tab.feed')}
          className="w-9 h-9 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          title={`${user.openTabsCount}`}
        >
          <img
            src={QQBROWSER_ASSETS.tabCountBox}
            alt={`${user.openTabsCount}`}
            className="w-[26px] h-[26px] object-contain"
          />
        </div>
      </div>

      {/* Main Scrollable Home Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar px-4 flex flex-col"
        data-scroll-container="home-main"
        data-scroll-direction="vertical"
      >
        {/* Center QBot Logo */}
        <div className="mt-24 mb-5 flex flex-col items-center">
          <div
            {...bindTap(
              { kind: 'action', id: 'home.qbot.toggle' },
              {
                params: { to: !qbotModeActive },
                onTrigger: () => toggleQbotMode(),
              },
            )}
            className="cursor-pointer active:scale-95 transition-transform flex flex-col items-center"
          >
            <img
              src={QQBROWSER_ASSETS.qbotLogo}
              alt="QBot"
              className="h-[68px] w-auto object-contain"
            />
            {qbotModeActive && (
              <span className="mt-2 px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-[11px] font-medium">
                {s.qbot_greeting}
              </span>
            )}
          </div>
        </div>

        {/* Rounded Search Pill with Light Blue/Purple Border */}
        <div
          {...bindTap('home.search.open')}
          className="w-full h-[64px] rounded-[22px] border-[1.5px] border-[#D3DCFA] bg-white/95 shadow-[0_6px_20px_rgba(145,165,235,0.12)] px-4 flex items-center cursor-pointer active:scale-[0.99] transition-transform"
        >
          <span className="flex-1 text-[16px] text-[#9AA3B2] font-normal truncate">
            {s.search_placeholder}
          </span>
          <div className="flex items-center gap-3.5 ml-2">
            <img
              src={QQBROWSER_ASSETS.searchVoice}
              alt="voice"
              className="w-[26px] h-[26px] object-contain"
            />
            <img
              src={QQBROWSER_ASSETS.searchCamera}
              alt="camera"
              className="w-[26px] h-[26px] object-contain"
            />
          </div>
        </div>

        {/* 8 Quick-Access Tools Grid (Row 1: 5 tools, Row 2: 3 tools) */}
        <div className="mt-8 space-y-5">
          {/* Row 1: 文件, 小说, 视频, 热搜好剧, 书签收藏 */}
          <div className="grid grid-cols-5 gap-1">
            {row1Shortcuts.map((item) => (
              <div
                key={item.id}
                {...bindTap(item.transition, item.params ? { params: item.params } : undefined)}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-[44px] h-[36px] overflow-hidden relative flex-shrink-0">
                  <img
                    src={QQBROWSER_ASSETS.shortcutsRow1}
                    alt={item.label}
                    className="max-w-none absolute"
                    style={{
                      width: '350px',
                      top: '-6px',
                      left: `${-(item.col * 71.4 + 10.3)}px`,
                    }}
                  />
                </div>
                <span className="text-[13px] text-[#11192D] font-normal mt-2 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2: 扫码, 搜狗搜索, DeepSeek */}
          <div className="grid grid-cols-5 gap-1">
            {row2Shortcuts.map((item) => (
              <div
                key={item.id}
                {...bindTap(item.transition, item.params ? { params: item.params } : undefined)}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-[44px] h-[36px] overflow-hidden relative flex-shrink-0">
                  <img
                    src={QQBROWSER_ASSETS.shortcutsRow2}
                    alt={item.label}
                    className="max-w-none absolute"
                    style={{
                      width: '350px',
                      top: '-6px',
                      left: `${-(item.col * 71.4 + 10.3)}px`,
                    }}
                  />
                </div>
                <span className="text-[13px] text-[#11192D] font-normal mt-2 truncate max-w-[66px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
