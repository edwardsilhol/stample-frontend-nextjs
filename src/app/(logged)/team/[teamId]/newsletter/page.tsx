import SendNewsletterButton from '../../../../../components/buttons/sendNewsletterButton';
import Stack from '@mui/material/Stack';

interface NewsletterPageProps {
  params: {
    teamId: string;
  };
}

function NewsletterPage({ params: { teamId } }: NewsletterPageProps) {
  return (
    <Stack justifyContent="center" alignItems="center" width="100%">
      <SendNewsletterButton teamId={teamId} />
    </Stack>
  );
}

export default NewsletterPage;
