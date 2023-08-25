import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { getTeamDisplayedName } from 'helpers/team.helper';
import { useRouter } from 'next/navigation';
import {
  useAnswerInvitation,
  useTeamByInvitation,
} from 'stores/hooks/team.hooks';

interface Props {
  teamId: string;
}
export const Invitation: React.FC<Props> = ({ teamId }) => {
  const { data: team } = useTeamByInvitation(teamId);
  const router = useRouter();
  const { mutateAsync: answerInvitation } = useAnswerInvitation();
  const teamName = team ? getTeamDisplayedName(team) : '';

  const onClickAnswerInvitation = async (accept: boolean) => {
    await answerInvitation({
      teamId,
      answerInvitationDto: {
        accept,
      },
    });

    router.push('/me');
  };
  if (!team) return <>No team</>;
  return (
    <Stack justifyContent="center" alignItems="center" spacing={2} padding={2}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            You have been invited to team {teamName}
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
};
