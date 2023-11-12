import Box from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { getDocumentHeaderStrings } from 'utils/document';
import { Document } from 'stores/types/document.types';
import { Fragment, useMemo } from 'react';
import Link from 'next/link';

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

  const colorSx = {
    color: 'black',
    opacity: 0.7,
    '&:hover': {
      opacity: 1,
      color: 'primary.main',
    },
  };

  const renderSeparator = (index: number) =>
    index > 0 && (
      <Box component="span" sx={colorSx}>
        {' • '}
      </Box>
    );

  return (
    <Typography variant="caption" sx={{ gap: 0.5 }} {...typographyProps}>
      {urlWebsiteName || url ? (
        <>
          {renderSeparator(0)}
          <Box
            component={Link}
            href={url}
            target="_blank"
            rel="noreferrer"
            sx={colorSx}
          >
            {urlWebsiteName ?? getHostname(url)}
          </Box>
        </>
      ) : null}

      {author ? (
        <>
          {renderSeparator(urlWebsiteName || url ? 1 : 0)}
          <Box
            component={Link}
            href={authorUrl || '#'}
            target="_blank"
            rel="noreferrer"
            sx={colorSx}
          >
            {author}
          </Box>
        </>
      ) : null}

      {Object.values(documentHeaderStrings)
        .filter((headerString): headerString is string => !!headerString)
        .map((headerString, index) => (
          <Fragment key={index}>
            {renderSeparator(
              index + (urlWebsiteName || url ? 1 : 0) + (author ? 1 : 0),
            )}
            <Box component="span" sx={colorSx}>
              {headerString}
            </Box>
          </Fragment>
        ))}
    </Typography>
  );
}

export default DocumentHeader;
