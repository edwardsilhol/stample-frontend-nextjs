import { UserForOtherClient } from '../../stores/types/user.types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { decodeHTML } from 'entities';

interface DocumentCreatorProps {
  creator: UserForOtherClient;
  insight: string;
}

function DocumentCreator({ creator, insight }: DocumentCreatorProps) {
  return (
    <Stack direction="column" alignItems="center">
      <Avatar
        sizes="large"
        src={creator?.profilePictureUrl}
        sx={{
          width: '80px',
          height: '80px',
          marginTop: '10px',
          marginBottom: '10px',
          border: '5px solid',
          borderColor: 'primary.main',
        }}
      >
        {creator?.profilePictureUrl
          ? null
          : `${creator.firstName[0]}${creator.lastName[0]}`}
      </Avatar>
      <Typography variant="h5" fontWeight={700} marginLeft={0}>
        {creator.firstName} {creator.lastName}
      </Typography>
      {insight && (
        <Box
          sx={{
            position: 'relative',
            background: '#f1f4fc',
            textAlign: 'center',
            width: '450px',
            height: 'auto',
            marginTop: '20px',
            marginBottom: '10px',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
            '&:after': {
              content: '""',
              position: 'absolute',
              display: 'block',
              width: 0,
              zIndex: 1,
              borderStyle: 'solid',
              borderColor: '#f1f4fc transparent',
              borderWidth: '0 15px 15px',
              top: '-15px',
              left: '50%',
              marginLeft: '-15px',
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: 'primary.main', fontStyle: 'italic' }}
          >
            {decodeHTML(insight)}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

export default DocumentCreator;
