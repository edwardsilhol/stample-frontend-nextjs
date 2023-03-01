import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { CustomSearchBar } from './CustomSearchBar';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    borderBottom: '1px solid #d3d4d5',
  },
});

interface LoggedHeaderProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const LoggedHeader: React.FC<LoggedHeaderProps> = ({
  searchValue,
  setSearchValue,
}) => {
  const classes = useStyles();

  return (
    <Stack direction={'column'} className={classes.container}>
      <Stack direction={'row'} padding={'8px 16px'}>
        <CustomSearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Stack>
    </Stack>
  );
};
