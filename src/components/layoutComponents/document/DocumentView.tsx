import React from 'react';
import Stack from '../../muiOverrides/Stack';
import { Divider, IconButton } from '@mui/material';
import { Close, OpenInNew } from '@mui/icons-material';
import { createUseStyles } from 'react-jss';
import { Document } from '../../../stores/types/document.types';
import Typography from '../../muiOverrides/Typography';
import { Tag } from '../../../stores/types/tag.types';

const useStyles = createUseStyles({
  container: {
    borderLeft: '1px solid #d3d4d5',
  },
});

interface DocumentViewProps {
  document?: Document;
  setDocumentId: (id: string) => void;
  tags?: Tag[];
}
export const DocumentView: React.FC<DocumentViewProps> = ({
  document,
  setDocumentId,
  tags,
}) => {
  const classes = useStyles();

  const getDocumentView = () => {
    return (
      <Stack
        direction={'column'}
        width={'100%'}
        padding={'10px 30px'}
        sx={{ maxHeight: 'calc(100vh - 42px)', flexGrow: 1, overflowY: 'auto' }}
      >
        <Typography variant={'h1'}>{document?.title}</Typography>
        <Typography
          fontSize={'11px'}
          fontWeight={400}
          color={'rgba(0, 0, 255, 0.8)'}
        >
          {document?.tags
            .map((tag) => tags?.find((t) => t._id === tag)?.name)
            .map((tag) => `#${tag}`)
            .join(' ')}
        </Typography>
        <Divider sx={{ margin: '10px 0' }} />
        {document?.content && (
          <div dangerouslySetInnerHTML={{ __html: document.content }} />
        )}
      </Stack>
    );
  };

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
        {document?.url && (
          <a href={document?.url} target={'_blank'} rel={'noreferrer'}>
            <IconButton sx={{ padding: '0 2px', borderRadius: '4px' }}>
              <OpenInNew />
            </IconButton>
          </a>
        )}
      </Stack>
      {!document ? (
        <Stack justifyContent={'center'} alignItems={'center'} height={'100%'}>
          <h1>Document not found</h1>
        </Stack>
      ) : (
        getDocumentView()
      )}
    </Stack>
  );
};
