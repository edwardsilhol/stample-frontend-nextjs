import { Box, Typography, TypographyProps } from '@mui/material';
import { getDocumentHeaderStrings } from 'helpers/document.helpers';
import React from 'react';
import { Document } from 'stores/types/document.types';

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
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (error) {
      return url;
    }
  };
  return (
    <Typography
      variant="caption"
      sx={{
        gap: 0.5,
      }}
      {...typographyProps}
    >
      {[
        ...(urlWebsiteName || url
          ? [
              <Box
                component="a"
                color="primary.dark"
                href={url}
                target="_blank"
                rel="noreferrer"
                key={0}
              >
                {urlWebsiteName ?? getHostname(url)}
              </Box>,
            ]
          : []),
        ...(author
          ? [
              <Box
                component="a"
                color="primary.dark"
                href={authorUrl}
                target="_blank"
                rel="noreferrer"
                key={1}
              >
                {author}
              </Box>,
            ]
          : []),
        ...Object.values(documentHeaderStrings)
          .filter((headerString): headerString is string => !!headerString)
          .map((headerString, index) => (
            <Box component="span" color="primary.dark" key={index + 2}>
              {headerString}
            </Box>
          )),
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
