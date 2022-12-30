import React from 'react';
import Typography from '../../../../../components/muiOverrides/Typography';
import Box from '../../../../../components/muiOverrides/Box';

interface PageParams {
  slug: string;
}

export const revalidate = 60; // revalidate interval for ISR
export async function generateStaticParams(): Promise<PageParams[]> {
  return [
    {
      slug: '1',
    },
    {
      slug: '2',
    },
    {
      slug: '3',
    },
  ];
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

async function ISRPage({ params: { slug } }: Props) {
  const styles = useStyles();
  const { title } = await getPageData(slug);

  return (
    <Box sx={styles.container}>
      <Typography variant="h1">{title}</Typography>
    </Box>
  );
}
export default ISRPage;
