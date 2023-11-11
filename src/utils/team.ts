import { capitalize } from 'lodash';
import { Team } from 'stores/types/team.types';
import {
  LocalRole,
  PopulatedUserAndPermissions,
} from '../stores/types/user.types';

export const getSortedTeams = (teams: Team[]) =>
  teams.sort((teamA, teamB) => {
    if (teamA.isPersonal && !teamB.isPersonal) {
      return -1;
    } else {
      return teamA.name > teamB.name ? 1 : teamA.name < teamB.name ? -1 : 0;
    }
  });

export const getTeamDisplayedName = (team: Team) => {
  if (team.isPersonal) {
    return 'Personal team';
  }
  return capitalize(team.name);
};

export function doesUserHaveTeamPrivilege(
  userId?: string,
  teamUsers?: PopulatedUserAndPermissions[],
) {
  if (!teamUsers || !userId) return false;
  const currentUserRole = teamUsers.find((u) => u.user._id === userId)?.role;
  return (
    currentUserRole === LocalRole.ADMIN || currentUserRole === LocalRole.OWNER
  );
}
