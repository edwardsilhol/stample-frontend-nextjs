import { SetStateAction, atom, useAtom } from 'jotai';
import { useTeam } from 'stores/hooks/tanstackQuery/team.hooks';
import { useSelectedTagId } from './tag.hooks';

const selectedTeamIdAtom = atom<string | null>(null);
export const useSelectedTeamId = (): [
  string | null,
  (id: SetStateAction<string | null>) => void,
] => {
  const [_, setSelectedTagId] = useSelectedTagId();
  const [selectedTeamId, setSelectedTeamId] = useAtom(selectedTeamIdAtom);
  return [
    selectedTeamId,
    (id: SetStateAction<string | null>) => {
      setSelectedTagId(null);
      setSelectedTeamId(id);
    },
  ];
};
export const useSelectedTeam = () => {
  const [selectedTeamId] = useSelectedTeamId();
  return useTeam(selectedTeamId);
};
