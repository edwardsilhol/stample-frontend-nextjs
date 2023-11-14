import DocumentView from 'components/views/documentView';

interface Props {
  params: {
    documentId: string;
    teamId: string;
  };
}
function DocumentPage({ params: { documentId, teamId } }: Props) {
  return <DocumentView teamId={teamId} documentId={documentId} />;
}

export default DocumentPage;
