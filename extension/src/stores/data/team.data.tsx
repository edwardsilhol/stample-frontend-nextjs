import { SetStateAction, atom, useAtom } from 'jotai';
import { useTeam } from '@src/stores/hooks/team.hooks';

const selectedTeamIdAtom = atom<string | null>(null);
export const useSelectedTeamId = (): [
  string | null,
  (id: SetStateAction<string | null>) => void,
] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTeamId, setSelectedTeamId] = useAtom(selectedTeamIdAtom);
  return [selectedTeamId, setSelectedTeamId];
};
