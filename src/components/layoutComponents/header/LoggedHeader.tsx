import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { CustomSearchBar } from './CustomSearchBar';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    borderBottom: '1px solid #d3d4d5',
  },
});

export const LoggedHeader: React.FC = () => {
  const classes = useStyles();

  return (
    <Stack direction={'column'} className={classes.container}>
      <Stack direction={'row'}>
        <CustomSearchBar />
      </Stack>
    </Stack>
  );
};
