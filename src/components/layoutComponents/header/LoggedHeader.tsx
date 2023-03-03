import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { CustomSearchBar } from './CustomSearchBar';
import { Button } from '@mui/material';

const useStyles = () => ({
  container: {
    height: '42px',
    borderBottom: '1px solid #d3d4d5',
  },
});

interface LoggedHeaderProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  setToggledAddButton: () => void;
}

export const LoggedHeader: React.FC<LoggedHeaderProps> = ({
  searchValue,
  setSearchValue,
  setToggledAddButton,
}) => {
  const styles = useStyles();

  return (
    <>
      <Stack direction={'column'} sx={styles.container}>
        <Stack
          direction={'row'}
          padding={'8px 16px'}
          justifyContent={'space-between'}
        >
          <CustomSearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={setToggledAddButton}
          >
            Add
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
