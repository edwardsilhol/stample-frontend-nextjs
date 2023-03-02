import React from 'react';
import { MainView } from '../../../../../components/MainView';

interface TagPageParams {
  id: string;
}
interface TagPageProps {
  params: TagPageParams;
}
const TagPage: React.FC<TagPageProps> = ({ params: { id } }) => {
  return <MainView tagId={id} />;
};

export default TagPage;
