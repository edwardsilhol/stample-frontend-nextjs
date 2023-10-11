import DocumentView from 'components/document/DocumentView';

interface Props {
  params: {
    id: string;
  };
}
function DocumentPage({ params: { id } }: Props) {
  return <DocumentView documentId={id} />;
}

export default DocumentPage;
