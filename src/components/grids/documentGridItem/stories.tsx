import { Meta } from '@storybook/react';
import DocumentGridItem from './index';
import { MinimalDocument } from '../../../stores/types/document.types';
import Box from '@mui/material/Box';

const fakeDocument: MinimalDocument = {
  _id: '12345abcde',
  title: 'Sample Document Title',
  summary: "Brief summary of the document's content.",
  keyInsight: 'Main insight derived from the content.',
  url: 'https://sample-url.com/document',
  team: 'Development',
  readers: ['user1', 'user2', 'user3'],
  likes: ['user4', 'user5'],
  tags: ['development', 'typescript', 'sample'],
  creator: {
    _id: '12345abcde',
    firstName: 'John',
    lastName: 'Doe',
    profilePictureUrl: 'https://picsum.photos/200',
  },
  createdAt: new Date(),
  type: 'note',
};
export default {
  title: 'Components/Grids/DocumentsGridItem',
  render: (args: any) => (
    <Box
      style={{
        width: '328px',
      }}
    >
      <DocumentGridItem {...args} />
    </Box>
  ),
  args: {
    document: fakeDocument,
    flatTags: ['development', 'typescript', 'sample'],
    onClick: () => console.log('Document clicked.'),
  },
  parameters: {
    layout: 'centered',
  },
} as Meta;

export const Default = {};

export const WithMainMedia = {
  args: {
    document: {
      ...fakeDocument,
      mainMedia: {
        html: '<p>Sample HTML content.</p>',
        mediaType: 'image',
        src: 'https://picsum.photos/200',
      },
    },
  },
};
