import { Box, Typography, TypographyProps } from '@mui/material';
import { getDocumentHeaderStrings } from '@src/helpers/document.helpers';
import { Document } from '@src/stores/types/document.types';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Fragment, ReactNode, useMemo } from 'react';

type DocumentHeaderProps = Pick<
  Document,
  'createdAt' | 'author' | 'url' | 'authorUrl'
> & {
  likesCount: number;
  readersCount: number;
  typographyProps?: TypographyProps;
};

function DocumentHeader({
  authorUrl,
  createdAt,
  author,
  likesCount,
  readersCount,
  typographyProps,
}: DocumentHeaderProps) {
  const documentHeaderStrings = useMemo(
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
          <Fragment key={index}>{component}</Fragment>,
        ],
        [] as ReactNode[],
      )}
    </Typography>
  );
}
export default DocumentHeader;
