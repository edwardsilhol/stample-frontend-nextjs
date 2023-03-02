import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { IconButton } from '@mui/material';
import { Close, OpenInNew } from '@mui/icons-material';
import { createUseStyles } from 'react-jss';
import { Document } from '../../../stores/types/document.types';

const useStyles = createUseStyles({
  container: {
    borderLeft: '1px solid #d3d4d5',
  },
});

interface DocumentViewProps {
  document?: Document;
  setDocumentId: (id: string) => void;
}
export const DocumentView: React.FC<DocumentViewProps> = ({
  document,
  setDocumentId,
}) => {
  const classes = useStyles();
  return (
    <Stack direction={'column'} width={'100%'} className={classes.container}>
      <Stack
        direction={'row'}
        padding={'8px 16px'}
        justifyContent={'space-between'}
      >
        <IconButton
          onClick={() => setDocumentId('')}
          sx={{ padding: '0 2px', borderRadius: '4px' }}
        >
          <Close />
        </IconButton>
        <a href={document?.url} target={'_blank'} rel={'noreferrer'}>
          <IconButton sx={{ padding: '0 2px', borderRadius: '4px' }}>
            <OpenInNew />
          </IconButton>
        </a>
      </Stack>
      {!document ? (
        <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
          <h1>Document not found</h1>
        </Stack>
      ) : (
        document.title
      )}
    </Stack>
  );
};
