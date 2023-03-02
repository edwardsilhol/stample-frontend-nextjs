import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface DocumentViewProps {
  documentId: string;
  setDocumentId: (id: string) => void;
}
export const DocumentView: React.FC<DocumentViewProps> = ({
  documentId,
  setDocumentId,
}) => {
  return (
    <Stack direction={'column'} width={'100%'}>
      <IconButton onClick={() => setDocumentId('')}>
        <Close />
      </IconButton>
      {documentId}
    </Stack>
  );
};
