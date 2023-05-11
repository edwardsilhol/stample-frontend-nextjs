import { atom, useAtom } from 'jotai';
import { useTeam } from 'stores/hooks/team.hooks';
import { useSelectedTagId } from './tag.data';
import { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectedTeamIdAtom = atom<string | null>(null);
export const useSelectedTeamId = () => {
  const [selectedTagId, setSelectedTagId] = useSelectedTagId();
  const teamIdHook = useAtom(selectedTeamIdAtom);
  useEffect(() => {
    if (selectedTagId) {
      setSelectedTagId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdHook[0]]);
  return teamIdHook;
};
export const useSelectedTeam = () => {
  const [selectedTeamId] = useSelectedTeamId();
  return useTeam(selectedTeamId);
};
