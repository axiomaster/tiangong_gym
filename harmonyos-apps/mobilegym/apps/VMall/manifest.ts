import { IcLauncher } from './res/icons';
import type { AppManifest } from '@/os/types/manifest';

export const manifest: AppManifest = {
  id: 'vmall',
  packageName: 'com.huawei.hmos.vmall',
  displayName: '华为商城',
  displayNameEn: 'VMall',
  version: '12.0.1.300',
  versionCode: 1,
  type: 'plugin',
  icon: IcLauncher,
  iconBackground: '#c7000b',
  iconForeground: '#ffffff',
  designViewportWidth: 390,
  theme: {
    colors: {
      primary: '#c7000b',
      background: '#f1f3f5',
      surface: '#ffffff',
      textPrimary: '#191919',
      textSecondary: '#888888',
      border: '#e5e5e5',
      statusBarForeground: 'dark',
      navigationBarForeground: 'dark',
    },
  },
};

export default manifest;
