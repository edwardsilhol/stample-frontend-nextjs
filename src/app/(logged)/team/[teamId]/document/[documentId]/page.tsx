import DocumentView from 'components/document/DocumentView';

interface Props {
  params: {
    documentId: string;
  };
}
function DocumentPage({ params: { documentId } }: Props) {
  return <DocumentView documentId={documentId} />;
}

export default DocumentPage;
