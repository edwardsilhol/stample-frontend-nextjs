import { atom, useAtom } from 'jotai';

const selectedTagIdAtom = atom<string | null>(null);
export const useSelectedTagId = () => useAtom(selectedTagIdAtom);
