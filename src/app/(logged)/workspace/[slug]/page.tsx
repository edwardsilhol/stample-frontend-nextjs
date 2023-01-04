import React from 'react';
import Box from '../../../../components/muiOverrides/Box';
import Typography from '../../../../components/muiOverrides/Typography';

interface PageParams {
  slug: string;
}
function useStyles() {
  return {
    container: {
      backgroundColor: 'primary.main',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };
}

async function getPageData(slug: string) {
  return {
    title: slug,
  };
}
interface Props {
  params: PageParams;
}

async function WorkspacePage({ params: { slug } }: Props) {
  const styles = useStyles();
  const { title } = await getPageData(slug);

  return (
    <Box sx={styles.container}>
      <Typography variant="h1">{title}</Typography>
    </Box>
  );
}
export default WorkspacePage;
