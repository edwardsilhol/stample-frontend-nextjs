import Invitation from '../../../../../components/cards/Invitation';
interface Props {
  params: {
    teamId: string;
  };
}
function InvitationPage({ params: { teamId } }: Props) {
  return <Invitation teamId={teamId} />;
}

export default InvitationPage;
