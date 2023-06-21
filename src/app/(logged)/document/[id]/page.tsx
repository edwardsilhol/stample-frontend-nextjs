import React from 'react';
import { DocumentView } from 'components/document/DocumentView';

interface Props {
  params: {
    id: string;
  };
}
const DocumentPage: React.FC<Props> = ({ params: { id } }) => {
  return <DocumentView documentId={id} />;
};

export default DocumentPage;
