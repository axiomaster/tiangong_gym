import { IcLauncher } from './res/icons';
import type { AppManifest } from '@/os/types/manifest';

export const manifest: AppManifest = {
  id: 'taobao',
  packageName: 'com.taobao.taobao4hmos',
  displayName: '淘宝',
  displayNameEn: 'Taobao',
  version: '10.42.0',
  versionCode: 1,
  type: 'plugin',
  icon: IcLauncher,
  iconBackground: '#FF5000',
  iconForeground: '#FFFFFF',
  designViewportWidth: 390,
  theme: {
    colors: {
      primary: '#FF5000',
      background: '#F4F4F6',
      surface: '#FFFFFF',
      textPrimary: '#11192D',
      textSecondary: '#50607A',
      border: '#EBEDF0',
      statusBarForeground: 'dark',
      navigationBarForeground: 'dark',
    },
  },
};

export default manifest;
