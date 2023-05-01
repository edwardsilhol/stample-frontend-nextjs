import { Box, Typography, TypographyProps } from '@mui/material';
import { getDocumentHeaderStrings } from '@src/helpers/document.helpers';
import React from 'react';
import { Document } from '@src/stores/types/document.types';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';
export const DocumentHeader: React.FC<
  Pick<
    Document,
    'urlWebsiteName' | 'createdAt' | 'author' | 'url' | 'authorUrl'
  > & {
    likesCount: number;
    readersCount: number;
    typographyProps?: TypographyProps;
  }
> = ({
  urlWebsiteName,
  url,
  authorUrl,
  createdAt,
  author,
  likesCount,
  readersCount,
  typographyProps,
}) => {
  const documentHeaderStrings = React.useMemo(
    () =>
      getDocumentHeaderStrings({
        createdAt,
        likesCount,
        readersCount,
      }),
    [createdAt, likesCount, readersCount],
  );

  return (
    <Typography
      variant="caption"
      sx={{
        gap: 0.5,
      }}
      {...typographyProps}
    >
      {[
        ...(urlWebsiteName
          ? [
              <Box
                component="a"
                color="primary.light"
                href={url}
                target="_blank"
                rel="noreferrer"
                key={0}
              >
                {urlWebsiteName}
              </Box>,
            ]
          : []),
        ...(author
          ? [
              <Box
                component="a"
                color="primary.light"
                href={authorUrl}
                target="_blank"
                rel="noreferrer"
                key={1}
              >
                {author}
              </Box>,
            ]
          : []),
        ...(documentHeaderStrings.openCountString
          ? [
              <Box component="span" key={2} sx={{ opacity: 0.5 }}>
                <RemoveRedEyeIcon
                  sx={{ fontSize: '12px', verticalAlign: 'middle' }}
                />
                &nbsp;
                {documentHeaderStrings.openCountString}
              </Box>,
            ]
          : []),
        ...(documentHeaderStrings.likeString
          ? [
              <Box component="span" key={3} sx={{ opacity: 0.5 }}>
                <FavoriteIcon
                  sx={{ fontSize: '12px', verticalAlign: 'middle' }}
                />
                &nbsp;
                {documentHeaderStrings.likeString}
              </Box>,
            ]
          : []),
        ...(documentHeaderStrings.documentDate
          ? [
              <Box component="span" key={4} sx={{ opacity: 0.5 }}>
                {documentHeaderStrings.documentDate}
              </Box>,
            ]
          : []),
      ].reduce(
        (accumulator, component, index) => [
          ...accumulator,
          ...(index !== 0
            ? [
                <Box component="span" color="black" key={`separator-${index}`}>
                  {' • '}
                </Box>,
              ]
            : []),
          <React.Fragment key={index}>{component}</React.Fragment>,
        ],
        [] as React.ReactNode[],
      )}
    </Typography>
  );
};
