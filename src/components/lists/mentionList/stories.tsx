import { Meta } from '@storybook/react';
import MentionList from './index';

export default {
  title: 'Components/Lists/MentionList',
  component: MentionList,
  args: {
    items: [
      {
        id: '1',
        label: 'John Doe',
        avatar: 'https://i.pravatar.cc/300?img=1',
      },
      {
        id: '2',
        label: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/300?img=2',
      },
      {
        id: '3',
        label: 'John Smith',
      },
    ],
    command: ({ id }: { id: string }) => console.log(id),
  },
} as Meta;

export const Default = {};
