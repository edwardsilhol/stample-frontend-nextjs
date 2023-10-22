import { Meta } from '@storybook/react';
import FloatingEditorMenuButtonsGroup from './index';
import Delete from '@mui/icons-material/Delete';

export default {
  title: 'Components/Buttons/FloatingEditorMenuButtonsGroup',
  component: FloatingEditorMenuButtonsGroup, // TODO: Fix this story
  args: {
    buttons: [
      {
        id: '1',
        onClick: () => {
          console.log('FloatingEditorMenuIcon clicked');
        },
        icon: <Delete />,
        label: 'text',
        isActive: false,
      },
      {
        id: '2',
        onClick: () => {
          console.log('FloatingEditorMenuIcon clicked');
        },
        icon: <Delete />,
        label: 'text',
        isActive: false,
      },
    ],
  },
} as Meta;

export const Default = {};
