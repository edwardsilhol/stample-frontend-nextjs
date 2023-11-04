import DocumentView from 'components/view/documentView';

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
