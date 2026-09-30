import { IcLauncher } from './res/icons';
import type { AppManifest } from '@/os/types/manifest';

export const manifest: AppManifest = {
  id: 'meituan',
  packageName: 'com.sankuai.hmeituan',
  displayName: '美团',
  displayNameEn: 'Meituan',
  version: '12.24.0',
  versionCode: 1,
  type: 'plugin',
  icon: IcLauncher,
  iconBackground: '#FFD100',
  iconForeground: '#11192D',
  designViewportWidth: 390,
  theme: {
    colors: {
      primary: '#FFD100',
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
