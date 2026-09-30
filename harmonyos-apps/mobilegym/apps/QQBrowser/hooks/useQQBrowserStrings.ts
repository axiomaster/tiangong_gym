import { useAppStrings } from '@/os/useAppStrings';
import { strings } from '../res/strings';
import { stringsEn } from '../res/strings.en';

export function useQQBrowserStrings() {
  return useAppStrings(strings, stringsEn);
}

export type QQBrowserStringKey = keyof typeof strings;
