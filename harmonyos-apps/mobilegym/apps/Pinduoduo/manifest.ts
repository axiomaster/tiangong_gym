import { IcLauncher } from './res/icons';
import type { AppManifest } from '@/os/types/manifest';

export const manifest: AppManifest = {
  id: 'pinduoduo',
  packageName: 'com.xunmeng.pinduoduo.hos',
  displayName: '拼多多',
  displayNameEn: 'Pinduoduo',
  version: '7.62.0',
  versionCode: 1,
  type: 'plugin',
  icon: IcLauncher,
  iconBackground: '#E02E24',
  iconForeground: '#FFFFFF',
  designViewportWidth: 390,
  theme: {
    colors: {
      primary: '#E02E24',
      background: '#F4F4F6',
      surface: '#FFFFFF',
      textPrimary: '#151516',
      textSecondary: '#58595B',
      border: '#EBEDF0',
      statusBarForeground: 'dark',
      navigationBarForeground: 'dark',
    },
  },
};

export default manifest;
