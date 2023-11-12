'use client';

import { useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import { MinimalDocument } from '../../stores/types/document.types';
import { useTagsByTeam } from '../../stores/hooks/tag.hooks';
import useScreenResizeObserver from 'use-resize-observer';
import DocumentsMasonry from './DocumentsMasonry';
import { useParams, useSearchParams } from 'next/navigation';
import { SEARCH_QUERY_PARAM } from '../../constants/queryParams.constant';
import CircularLoading from '../base/circularLoading';
import { RouteParams } from '../../stores/types/global.types';

export const DOCUMENTS_VIEW_SCROLLABLE_CONTAINER_ID =
  'documents-view-scrollable';

interface DocumentViewProps {
  documents: MinimalDocument[];
  fetchNextPage: () => void;
  totalDocumentsCount: number;
}

function DocumentsView({
  documents,
  totalDocumentsCount,
  fetchNextPage,
}: DocumentViewProps) {
  const { teamId, tagId } = useParams<RouteParams>();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get(SEARCH_QUERY_PARAM);
  const {
    data: { raw: flatTags },
    isLoading,
  } = useTagsByTeam(teamId);
  const searchId = useMemo(
    () => `${teamId}-${tagId}-${searchQuery}`,
    [tagId, searchQuery, teamId],
  );
  const ref = useRef<HTMLElement | null>(null);
  const { width, height } = useScreenResizeObserver({
    ref,
  });
  return isLoading ? (
    <CircularLoading />
  ) : (
    <Box paddingX={{ xs: 1, sm: 2 }} paddingY={{ xs: 1 }}>
      <Box
        sx={{
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'hidden',
          minHeight: '100%',
        }}
        ref={ref}
      >
        <DocumentsMasonry
          variant="grid"
          teamId={teamId}
          documents={documents}
          flatTags={flatTags}
          searchId={searchId}
          containerWidth={width}
          fetchNextPage={fetchNextPage}
          total={totalDocumentsCount}
        />
      </Box>
    </Box>
  );
}
export default DocumentsView;
