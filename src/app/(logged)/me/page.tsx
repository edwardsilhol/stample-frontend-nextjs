'use client';

import { DocumentView } from 'components/document/DocumentView';
import React, { useEffect } from 'react';
import { MainView } from '../../../components/MainView';
import { useCurrentlyViewedDocumentId } from '../../../stores/data/document.data';

const DefaultPage: React.FC = () => {
  const [documentId] = useCurrentlyViewedDocumentId();
  return (
    <>
      {!!documentId && <DocumentView documentId={documentId} />}
      <MainView isDisplayed={!documentId} />
    </>
  );
};

export default DefaultPage;
