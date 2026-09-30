import { IcLauncher } from './res/icons';
import type { AppManifest } from '@/os/types/manifest';

export const manifest: AppManifest = {
  id: 'baidunetdisk',
  packageName: 'com.baidu.netdisk.hmos',
  displayName: '百度网盘',
  displayNameEn: 'Baidu Netdisk',
  version: '12.18.0',
  versionCode: 1,
  type: 'plugin',
  icon: IcLauncher,
  iconBackground: '#06A7FF',
  iconForeground: '#FFFFFF',
  designViewportWidth: 390,
  theme: {
    colors: {
      primary: '#06A7FF',
      background: '#F4F7FC',
      surface: '#FFFFFF',
      textPrimary: '#191C24',
      textSecondary: '#737987',
      border: '#EBEDF0',
      statusBarForeground: 'dark',
      navigationBarForeground: 'dark',
    },
  },
};

export default manifest;
