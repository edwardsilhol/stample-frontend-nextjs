import DocumentView from 'components/view/documentView';

interface Props {
  params: {
    documentId: string;
  };
}
function DocumentPage({ params: { documentId } }: Props) {
  return <DocumentView documentId={documentId} />;
}

export default DocumentPage;
