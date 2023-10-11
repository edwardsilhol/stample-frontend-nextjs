import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getTeamDisplayedName } from 'helpers/team.helper';
import { useRouter } from 'next/navigation';
import {
  useAnswerInvitation,
  useTeamByInvitation,
} from 'stores/hooks/team.hooks';

interface InvitationProps {
  teamId: string;
}
function Invitation({ teamId }: InvitationProps) {
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
}
export default Invitation;
