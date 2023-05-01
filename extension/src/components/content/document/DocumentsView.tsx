'use-client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import { Document } from '../../../stores/types/document.types';
import { Tag } from '@src/stores/types/tag.types';
import { DocumentHeader } from './DocumentHeader';
import { DocumentTags } from './DocumentTags';
import { Masonry } from '@mui/lab';
import { useSearchDocuments } from '@src/stores/hooks/document.hooks';
import { getGoogleSearchQuery } from '@src/helpers/content-script.helpers';
import { useAllTags } from '@src/stores/hooks/tag.hooks';

const DocumentGridItem: React.FC<{
  document: Document;
  flatTags?: Tag[];
}> = ({ document, flatTags }) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
      }}
    >
      {document.mainMedia?.src ? (
        <CardMedia
          sx={{
            height: '100px',
          }}
          image={document.mainMedia?.src}
        />
      ) : null}
      <CardContent
        sx={{
          overflow: 'hidden',
          height: '100%',
          '&:last-child': {
            paddingBottom: 2,
          },
          flex: 3,
          backgroundColor: 'additionalColors.sidebarBackground',
        }}
      >
        <Box
          sx={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="body2"
            fontWeight={550}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              fontFamily: 'Google Sans,arial,sans-serif;',
            }}
          >
            <span style={{ color: 'grey', fontSize: '12px' }}>
              {document.urlWebsiteName ? (
                <>{document.urlWebsiteName}&nbsp;&nbsp;</>
              ) : null}
            </span>
            {document.title}
          </Typography>
          <Typography
            variant="caption"
            color="primary.dark"
            sx={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              fontFamily: 'Google Sans,arial,sans-serif;',
            }}
          >
            {document.summary}
          </Typography>
          <Box paddingY={1}>
            <DocumentTags
              tags={flatTags}
              documentTagsIds={document.tags}
              maxLines={1}
            />
          </Box>
          <DocumentHeader
            {...document}
            likesCount={document.likes?.length ?? 0}
            readersCount={document.readers?.length ?? 0}
            typographyProps={{
              sx: {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontFamily: 'Google Sans,arial,sans-serif;',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export const DocumentsView: React.FC = () => {
  const {
    data: { raw: flatTags },
    isLoading,
  } = useAllTags();
  const { data: documents } = useSearchDocuments({
    text: getGoogleSearchQuery(document),
  });
  return isLoading ? null : (
    <Stack
      direction="row"
      flex={1}
      sx={{
        overflowY: 'hidden',
        overflowX: 'hidden',
        width: 'var(--center-width);',
      }}
    >
      <Box
        padding={{ xs: 1, sm: 2 }}
        sx={{
          height: '100%',
          width: '100%',
          flex: { md: 1 },
          overflowY: 'auto',
        }}
      >
        <Masonry
          columns={{
            xs: 1,
            sm: 2,
          }}
          spacing={2}
          sx={{
            flex: 1,
            marginRight: 0,
            '&.MuiMasonry-root': {
              margin: 0,
            },
          }}
        >
          {(documents || []).map((document, index) => (
            <DocumentGridItem
              key={index}
              document={document}
              flatTags={flatTags}
            />
          ))}
        </Masonry>
      </Box>
    </Stack>
  );
};
