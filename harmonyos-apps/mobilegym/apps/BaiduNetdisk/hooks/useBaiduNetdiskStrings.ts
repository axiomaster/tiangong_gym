import { useAppStrings } from '@/os/useAppStrings';
import { strings } from '../res/strings';
import { stringsEn } from '../res/strings.en';

export function useBaiduNetdiskStrings() {
  return useAppStrings(strings, stringsEn);
}

export type BaiduNetdiskStringKey = keyof typeof strings;
