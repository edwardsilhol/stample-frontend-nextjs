import React from 'react';

interface DocumentViewProps {
  documentId: string;
}
export const DocumentView: React.FC<DocumentViewProps> = ({
  documentId,
}: DocumentViewProps) => {
  return <div>{`Document ${documentId}`}</div>;
};
