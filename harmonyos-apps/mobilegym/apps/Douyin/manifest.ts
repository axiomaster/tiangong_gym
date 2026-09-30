import { IcLauncher } from './res/icons';
import type { AppManifest } from '@/os/types/manifest';

export const manifest: AppManifest = {
  id: 'douyin',
  packageName: 'com.ss.hm.ugc.aweme',
  displayName: '抖音',
  displayNameEn: 'Douyin',
  version: '31.8.0',
  versionCode: 1,
  type: 'plugin',
  icon: IcLauncher,
  iconBackground: '#111111',
  iconForeground: '#FFFFFF',
  designViewportWidth: 390,
  theme: {
    colors: {
      primary: '#FE2C55',
      background: '#000000',
      surface: '#161622',
      textPrimary: '#FFFFFF',
      textSecondary: '#A0A0B0',
      border: '#262636',
      statusBarForeground: 'light',
      navigationBarForeground: 'light',
    },
  },
};

export default manifest;
