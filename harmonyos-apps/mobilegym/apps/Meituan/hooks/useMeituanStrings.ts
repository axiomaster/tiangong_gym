import { useAppStrings } from '@/os/useAppStrings';
import { strings } from '../res/strings';
import { stringsEn } from '../res/strings.en';

export function useMeituanStrings() {
  return useAppStrings(strings, stringsEn);
}

export type MeituanStringKey = keyof typeof strings;
