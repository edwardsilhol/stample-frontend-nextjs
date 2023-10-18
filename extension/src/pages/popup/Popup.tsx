import { useSession } from '@src/stores/hooks/user.hooks';
import SignInForm from '@src/components/forms/auth/signInForm/SignInForm';
import WebClipper from '@src/components/webClipper/WebClipper';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Avatar } from '@mui/material';
import { getImageUrl } from '@src/helpers/content.helpers';
import { Stack } from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useIsDocumentClippable } from '@src/stores/hooks/clipper.hooks';
const ContentNotClippable = () => (
  <Box padding={1}>
    <Typography variant="h5" fontWeight={500}>
      This page is not clippable. Please try another page.
    </Typography>
  </Box>
);

const PopupContent = () => {
  const { data: user, isLoading } = useSession();
  const { data: isClippable } = useIsDocumentClippable();
  if (isLoading || isClippable === undefined) {
    return <CircularProgress />;
  }
  if (user && isClippable) {
    return <WebClipper />;
  } else if (user && !isClippable) {
    return <ContentNotClippable />;
  }
  return <SignInForm />;
};
const Popup = () => {
  const onClose = () => {
    window.close();
  };

  return (
    <Stack padding={1} minWidth="400px">
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        paddingBottom={2}
      >
        <Avatar src={getImageUrl('/icons/icon128.png')} />
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <PopupContent />
    </Stack>
  );
};

export default Popup;
