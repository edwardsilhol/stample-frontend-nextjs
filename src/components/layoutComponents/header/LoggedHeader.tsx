import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { CustomSearchBar } from './CustomSearchBar';
import { Button, IconButton } from '@mui/material';
import { ArrowLeft } from '@mui/icons-material';
import { useTags } from 'stores/hooks/tag.hooks';

interface LoggedHeaderProps {
  searchValue: string;
  addButtonToggled: boolean;
  setSearchValue: (value: string) => void;
  setToggledAddButton: (toggled: boolean) => void;
}

export const LoggedHeader: React.FC<LoggedHeaderProps> = ({
  searchValue,
  addButtonToggled,
  setSearchValue,
  setToggledAddButton,
}) => {
  const {
    data: { raw: tags },
  } = useTags();
  return (
    <>
      <Stack
        direction={'column'}
        sx={{ borderBottom: '1px solid #d3d4d5' }}
        height="50px"
      >
        <Stack
          direction={'row'}
          padding={'8px 16px'}
          justifyContent={'space-between'}
        >
          {addButtonToggled ? (
            <IconButton onClick={() => setToggledAddButton(false)}>
              <ArrowLeft />
            </IconButton>
          ) : (
            <>
              <CustomSearchBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                tags={tags}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setToggledAddButton(true)}
              >
                Add
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
};
