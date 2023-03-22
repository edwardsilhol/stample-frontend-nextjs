import { Box, Typography, TypographyProps } from '@mui/material';
import { getDocumentHeaderStrings } from 'helpers/document.helpers';
import React from 'react';
import { Document } from 'stores/types/document.types';

export const DocumentHeader: React.FC<
  Pick<Document, 'urlWebsiteName' | 'createdAt' | 'author'> & {
    likesCount: number;
    readersCount: number;
    typographyProps?: TypographyProps;
  }
> = ({
  urlWebsiteName,
  createdAt,
  author,
  likesCount,
  readersCount,
  typographyProps,
}) => {
  const documentHeaderStrings = React.useMemo(
    () =>
      getDocumentHeaderStrings({
        urlWebsiteName,
        createdAt,
        author,
        likesCount,
        readersCount,
      }),
    [urlWebsiteName, createdAt, author, likesCount, readersCount],
  );

  return (
    <Typography
      variant="caption"
      sx={{
        gap: 0.5,
      }}
      {...typographyProps}
    >
      {documentHeaderStrings.reduce(
        (accumulator, component, index) => [
          ...accumulator,
          ...(index !== 0
            ? [
                <Box component="span" color="black" key={`separator-${index}`}>
                  {' • '}
                </Box>,
              ]
            : []),
          <Box component="span" color="primary.light" key={index}>
            {component}
          </Box>,
        ],
        [] as React.ReactNode[],
      )}
    </Typography>
  );
};
