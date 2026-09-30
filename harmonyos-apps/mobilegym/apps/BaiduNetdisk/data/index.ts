import defaults from './defaults.json';
import type {
  BaiduFileItem,
  BaiduMemoryCard,
  BaiduAiPrompt,
  BaiduShareGroup,
  BaiduUserProfile,
} from '../types';

import imgTopTv from '../assets/images/top_tv.png';
import imgTopTransfer from '../assets/images/top_transfer.png';
import imgTopPlus from '../assets/images/top_plus.png';
import imgKkAlbum from '../assets/images/kk_album.png';
import imgKkNovel from '../assets/images/kk_novel.png';
import imgKkScan from '../assets/images/kk_scan.png';
import imgKkNote from '../assets/images/kk_note.png';
import imgKkDrama from '../assets/images/kk_drama.png';
import imgIcLinkFile from '../assets/images/ic_link_file.png';
import imgIcFolder from '../assets/images/ic_folder.png';
import imgMemoryXian from '../assets/images/memory_xian.png';
import imgMemoryOcean from '../assets/images/memory_ocean.png';
import imgTabHome from '../assets/images/tab_home.png';
import imgTabFiles from '../assets/images/tab_files.png';
import imgTabKukuAi from '../assets/images/tab_kuku_ai.png';
import imgTabShare from '../assets/images/tab_share.png';
import imgTabMe from '../assets/images/tab_me.png';

export * from '../types';

export const BAIDU_NETDISK_ASSETS = {
  topTv: imgTopTv,
  topTransfer: imgTopTransfer,
  topPlus: imgTopPlus,
  kkAlbum: imgKkAlbum,
  kkNovel: imgKkNovel,
  kkScan: imgKkScan,
  kkNote: imgKkNote,
  kkDrama: imgKkDrama,
  icLinkFile: imgIcLinkFile,
  icFolder: imgIcFolder,
  memoryXian: imgMemoryXian,
  memoryOcean: imgMemoryOcean,
  tabHome: imgTabHome,
  tabFiles: imgTabFiles,
  tabKukuAi: imgTabKukuAi,
  tabShare: imgTabShare,
  tabMe: imgTabMe,
} as const;

export function getMemoryImage(key: BaiduMemoryCard['imageKey']): string {
  switch (key) {
    case 'memory_xian':
      return BAIDU_NETDISK_ASSETS.memoryXian;
    case 'memory_ocean':
      return BAIDU_NETDISK_ASSETS.memoryOcean;
    default:
      return BAIDU_NETDISK_ASSETS.memoryXian;
  }
}

export function getFileIcon(file: BaiduFileItem): string {
  if (file.fileType === 'link') {
    return BAIDU_NETDISK_ASSETS.icLinkFile;
  }
  if (file.id === 'file_xian_album') {
    return BAIDU_NETDISK_ASSETS.memoryXian;
  }
  if (file.id === 'file_ocean_album') {
    return BAIDU_NETDISK_ASSETS.memoryOcean;
  }
  return BAIDU_NETDISK_ASSETS.icFolder;
}

export const BAIDU_NETDISK_CONFIG = {
  user: defaults.user as BaiduUserProfile,
  searchPlaceholder: defaults.searchPlaceholder as string,
  searchDiscover: defaults.searchDiscover as string[],
  files: defaults.files as BaiduFileItem[],
  memories: defaults.memories as BaiduMemoryCard[],
  aiPrompts: defaults.aiPrompts as BaiduAiPrompt[],
  shareGroups: defaults.shareGroups as BaiduShareGroup[],
} as const;
