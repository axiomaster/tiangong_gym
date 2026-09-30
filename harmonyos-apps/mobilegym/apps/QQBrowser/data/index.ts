import defaults from './defaults.json';
import type {
  QQBrowserArticle,
  QQBrowserNovel,
  QQBrowserFileItem,
  QQBrowserUserProfile,
} from '../types';

import imgWeather29 from '../assets/images/weather_29.png';
import imgTabCountBox from '../assets/images/tab_count_box.png';
import imgQbotLogo from '../assets/images/qbot_logo.png';
import imgSearchVoice from '../assets/images/search_voice.png';
import imgSearchCamera from '../assets/images/search_camera.png';
import imgShortcutsRow1 from '../assets/images/shortcuts_row1.png';
import imgShortcutsRow2 from '../assets/images/shortcuts_row2.png';
import imgTabFeed from '../assets/images/tab_feed.png';
import imgTabNovel from '../assets/images/tab_novel.png';
import imgTabHome from '../assets/images/tab_home.png';
import imgTabFiles from '../assets/images/tab_files.png';
import imgTabMe from '../assets/images/tab_me.png';

export * from '../types';

export const QQBROWSER_ASSETS = {
  weather29: imgWeather29,
  tabCountBox: imgTabCountBox,
  qbotLogo: imgQbotLogo,
  searchVoice: imgSearchVoice,
  searchCamera: imgSearchCamera,
  shortcutsRow1: imgShortcutsRow1,
  shortcutsRow2: imgShortcutsRow2,
  tabFeed: imgTabFeed,
  tabNovel: imgTabNovel,
  tabHome: imgTabHome,
  tabFiles: imgTabFiles,
  tabMe: imgTabMe,
} as const;

export const QQBROWSER_CONFIG = {
  user: defaults.user as QQBrowserUserProfile,
  searchHotKeywords: defaults.searchHotKeywords as string[],
  articles: defaults.articles as QQBrowserArticle[],
  novels: defaults.novels as QQBrowserNovel[],
  files: defaults.files as QQBrowserFileItem[],
} as const;
