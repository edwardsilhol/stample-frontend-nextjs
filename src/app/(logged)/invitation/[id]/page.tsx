import Invitation from '../../../../components/team/Invitation';
interface Props {
  params: {
    id: string;
  };
}
function InvitationPage({ params: { id } }: Props) {
  return <Invitation teamId={id} />;
}

export default InvitationPage;
