import { atom, useAtom } from 'jotai';
import { useTeam } from 'stores/hooks/team.hooks';

const selectedTeamIdAtom = atom<string | null>(null);
export const useSelectedTeamId = () => useAtom(selectedTeamIdAtom);
export const useSelectedTeam = () => {
  const [selectedTeamId] = useSelectedTeamId();
  return useTeam(selectedTeamId);
};
