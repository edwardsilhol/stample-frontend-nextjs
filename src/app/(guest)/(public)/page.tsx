import React from 'react';
import Box from '../../../components/muiOverrides/Box';
import Typography from '../../../components/muiOverrides/Typography';

function useStyles() {
  return {
    container: {
      height: '100vh',
      my: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };
}

async function HomePage() {
  const styles = useStyles();

  return (
    <Box sx={styles.container}>
      <Typography variant="h1">Home</Typography>
    </Box>
  );
}
export default HomePage;
