import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { CustomSearchBar } from './CustomSearchBar';
import { createUseStyles } from 'react-jss';
import { Document } from '../../../stores/types/document.types';

const useStyles = createUseStyles({
  container: {
    borderBottom: '1px solid #d3d4d5',
  },
});

interface LoggedHeaderProps {
  documents: Document[];
}

export const LoggedHeader: React.FC<LoggedHeaderProps> = ({ documents }) => {
  const classes = useStyles();

  return (
    <Stack direction={'column'} className={classes.container}>
      <Stack direction={'row'}>
        <CustomSearchBar documents={documents} />
      </Stack>
    </Stack>
  );
};
