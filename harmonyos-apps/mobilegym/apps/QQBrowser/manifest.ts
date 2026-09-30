import { IcLauncher } from './res/icons';
import type { AppManifest } from '@/os/types/manifest';

export const manifest: AppManifest = {
  id: 'qqbrowser',
  packageName: 'com.tencent.mtthm',
  displayName: 'QQ浏览器',
  displayNameEn: 'QQ Browser',
  version: '15.2.0',
  versionCode: 1,
  type: 'plugin',
  icon: IcLauncher,
  iconBackground: '#0066FF',
  iconForeground: '#FFFFFF',
  designViewportWidth: 390,
  theme: {
    colors: {
      primary: '#0066FF',
      background: '#FFFFFF',
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
