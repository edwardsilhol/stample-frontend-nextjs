import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { CustomSearchBar } from './CustomSearchBar';
import { createUseStyles } from 'react-jss';
import { Button, Dialog } from '@mui/material';
import { CreateDocumentForm } from '../../forms/document/CreateDocumentForm';

const useStyles = createUseStyles({
  container: {
    height: '42px',
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
  const [open, setOpen] = React.useState(false);

  const handleOpenCreateDocument = () => {
    setOpen(true);
  };

  const getCreateDocumentDialog = () => {
    return (
      <Dialog open={open} onClose={() => setOpen(false)}>
        <CreateDocumentForm />
      </Dialog>
    );
  };

  return (
    <>
      <Stack direction={'column'} className={classes.container}>
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
            onClick={handleOpenCreateDocument}
          >
            Add
          </Button>
        </Stack>
      </Stack>
      {getCreateDocumentDialog()}
    </>
  );
};
