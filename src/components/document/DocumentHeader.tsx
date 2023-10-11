import Box from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { getDocumentHeaderStrings } from 'helpers/document.helpers';
import { Document } from 'stores/types/document.types';
import { Fragment, ReactNode, useMemo } from 'react';

type DocumentHeaderProps = Pick<
  Document,
  'urlWebsiteName' | 'createdAt' | 'author' | 'url' | 'authorUrl'
> & {
  likesCount: number;
  readersCount: number;
  typographyProps?: TypographyProps;
};

function DocumentHeader({
  urlWebsiteName,
  url,
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
          <Fragment key={index}>{component}</Fragment>,
        ],
        [] as ReactNode[],
      )}
    </Typography>
  );
}
export default DocumentHeader;
