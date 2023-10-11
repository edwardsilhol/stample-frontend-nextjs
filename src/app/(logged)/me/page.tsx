'use client';

import DocumentView from 'components/document/DocumentView';
import MainView from '../../../components/MainView';
import { useCurrentlyViewedDocumentId } from '../../../stores/data/document.data';

function DefaultPage() {
  const [documentId] = useCurrentlyViewedDocumentId();
  return (
    <>
      {!!documentId && <DocumentView documentId={documentId} />}
      <MainView isDisplayed={!documentId} />
    </>
  );
}

export default DefaultPage;
