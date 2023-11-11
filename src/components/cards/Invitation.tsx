'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getTeamDisplayedName } from 'utils/team';
import { useRouter } from 'next/navigation';
import { useAnswerInvitation } from 'stores/hooks/team.hooks';
import { Team } from '../../stores/types/team.types';
import { TEAM_ROUTE } from '../../constants/routes.constant';

interface InvitationProps {
  team: Team;
}
function Invitation({ team }: InvitationProps) {
  const router = useRouter();
  const answerInvitation = useAnswerInvitation();

  const onClickAnswerInvitation = async (accept: boolean) => {
    await answerInvitation.mutateAsync({
      teamId: team._id,
      answerInvitationDto: {
        accept,
      },
    });

    router.push(`${TEAM_ROUTE}/${team._id}`);
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}
      padding={2}
      height="100%"
    >
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            You have been invited to team {getTeamDisplayedName(team)}
          </Typography>
          Accept the invitation ?
        </CardContent>

        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => onClickAnswerInvitation(false)}
          >
            Refuse
          </Button>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() => onClickAnswerInvitation(true)}
          >
            Accept
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
}
export default Invitation;
