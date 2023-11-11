'use client';

import Link from 'next/link';
import {
  NEWSLETTER_ROUTE,
  TEAM_ROUTE,
} from '../../../constants/routes.constant';
import Stack from '@mui/material/Stack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Typography from '@mui/material/Typography';

interface GotoNewsletterButtonProps {
  teamId: string;
  userHasPrivilege: boolean;
  isPersonalTeam: boolean;
}
function GotoNewsletterButton({
  teamId,
  userHasPrivilege,
  isPersonalTeam,
}: GotoNewsletterButtonProps) {
  return userHasPrivilege && !isPersonalTeam ? (
    <>
      <Typography fontSize="10px" fontWeight={500}>
        NEWSLETTER
      </Typography>
      <Link
        href={`${TEAM_ROUTE}/${teamId}${NEWSLETTER_ROUTE}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1.5}
          width="100%"
          overflow="hidden"
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            overflow="hidden"
          >
            <MailOutlineIcon fontSize="small" color="primary" />
            <Typography variant="body2" textOverflow="ellipsis">
              Access editor
            </Typography>
          </Stack>
        </Stack>
      </Link>
    </>
  ) : (
    <></>
  );
}

export default GotoNewsletterButton;
