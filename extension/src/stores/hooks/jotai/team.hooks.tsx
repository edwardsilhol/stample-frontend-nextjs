import { SetStateAction, atom, useAtom } from 'jotai';

const selectedTeamIdAtom = atom<string | null>(null);
export const useSelectedTeamId = (): [
  string | null,
  (id: SetStateAction<string | null>) => void,
] => {
  const [selectedTeamId, setSelectedTeamId] = useAtom(selectedTeamIdAtom);
  return [selectedTeamId, setSelectedTeamId];
};
