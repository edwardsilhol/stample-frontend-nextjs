'use client';

import { useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import { MinimalDocument } from '../../stores/types/document.types';
import { useSelectedTeamTags } from '../../stores/hooks/tanstackQuery/tag.hooks';
import { useSelectedTagId } from 'stores/hooks/jotai/tag.hooks';
import { useSearchDocumentsQuery } from 'stores/hooks/jotai/document.hooks';
import { useSelectedTeamId } from 'stores/hooks/jotai/team.hooks';
import useScreenResizeObserver from 'use-resize-observer';
import DocumentsMasonry from './DocumentsMasonry';

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
  const {
    data: { raw: flatTags },
  } = useSelectedTeamTags();
  const [selectedTagId] = useSelectedTagId();
  const [searchDocumentsQuery] = useSearchDocumentsQuery();
  const [selectedTeamId] = useSelectedTeamId();
  const searchId = useMemo(
    () => `${selectedTeamId}-${selectedTagId}-${searchDocumentsQuery}`,
    [selectedTagId, searchDocumentsQuery, selectedTeamId],
  );
  const ref = useRef<HTMLElement | null>(null);
  const { width } = useScreenResizeObserver({
    ref,
  });
  return (
    <Box paddingX={{ xs: 1, sm: 2 }} paddingY={{ xs: 1 }}>
      <Box
        sx={{
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'hidden',
          height: 'auto',
          minHeight: '100%',
        }}
        ref={ref}
      >
        <DocumentsMasonry
          variant="grid"
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
