import { SetStateAction, atom, useAtom } from 'jotai';
import { useTeam } from 'stores/hooks/team.hooks';
import { useSelectedTagId } from './tag.data';

const selectedTeamIdAtom = atom<string | null>(null);
export const useSelectedTeamId = (): [
  string | null,
  (id: SetStateAction<string | null>) => void,
] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
