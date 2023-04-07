import { capitalize } from 'lodash';
import { Team } from 'stores/types/team.types';

export const getDefaultSelectedTeamId = (teams: Team[]): string | null => {
  const personalTeam = teams.find((team) => team.isPersonal);
  if (personalTeam) {
    return personalTeam._id;
  } else if (teams.length > 0) {
    return teams[0]._id;
  }
  return null;
};

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
