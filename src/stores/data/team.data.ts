import { atom, useAtom } from 'jotai';

const selectedTeamIdAtom = atom<string | null>(null);
export const useSelectedTeamId = () => useAtom(selectedTeamIdAtom);
