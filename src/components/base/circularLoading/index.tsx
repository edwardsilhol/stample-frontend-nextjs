import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

function CircularLoading() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <CircularProgress />
    </Stack>
  );
}

export default CircularLoading;
