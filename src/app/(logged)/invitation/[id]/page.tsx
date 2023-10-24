import Invitation from '../../../../components/cards/Invitation';
interface Props {
  params: {
    id: string;
  };
}
function InvitationPage({ params: { id } }: Props) {
  return <Invitation teamId={id} />;
}

export default InvitationPage;
