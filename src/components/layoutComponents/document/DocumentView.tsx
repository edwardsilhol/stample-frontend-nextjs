import React, { useMemo } from 'react';
import Stack from '../../muiOverrides/Stack';
import { CircularProgress, Divider, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Typography from '../../muiOverrides/Typography';
import { Tag } from '../../../stores/types/tag.types';
import { useDocument } from '../../../stores/hooks/document.hooks';

interface DocumentViewProps {
  documentId: string;
  setDocumentId: (id: string) => void;
  tags?: Tag[];
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  documentId,
  setDocumentId,
  tags,
}) => {
  const { data: document, isLoading } = useDocument(documentId);
  const tagsString = useMemo(
    () =>
      document?.tags
        ?.map((tag) => tags?.find((t) => t._id === tag)?.name)
        ?.map((tag) => `#${tag}`)
        ?.join(' '),
    [document, tags],
  );

  return (
    <Stack
      direction={'column'}
      width={'100%'}
      sx={{
        borderLeft: '1px solid #d3d4d5',
      }}
      padding={2}
    >
      <Stack direction="row" alignItems="center">
        <IconButton
          onClick={() => setDocumentId('')}
          sx={{ padding: '0 2px', borderRadius: '4px' }}
        >
          <Close />
        </IconButton>
      </Stack>
      {isLoading ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Stack>
      ) : !document ? (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <h1>Document not found</h1>
        </Stack>
      ) : (
        <Stack padding={1}>
          <Typography variant="h1">{document.title}</Typography>
          <Typography
            fontSize={'11px'}
            fontWeight={400}
            color={'rgba(0, 0, 255, 0.8)'}
          >
            {tagsString}
          </Typography>
          <Divider sx={{ margin: '10px 0' }} />
          <div dangerouslySetInnerHTML={{ __html: document.content }} />
        </Stack>
      )}
    </Stack>
  );
};
