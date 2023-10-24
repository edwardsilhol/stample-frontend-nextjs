'use client';

import DocumentView from 'components/document/DocumentView';
import { useCurrentlyViewedDocumentId } from '../../../../stores/hooks/jotai/document.hooks';

function DocumentPage() {
  const [documentId] = useCurrentlyViewedDocumentId();
  return documentId ? <DocumentView documentId={documentId} /> : <></>;
}

export default DocumentPage;
