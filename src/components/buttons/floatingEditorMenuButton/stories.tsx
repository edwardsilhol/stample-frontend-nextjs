import { Meta } from '@storybook/react';
import FloatingEditorMenuButton from './index';
import Delete from '@mui/icons-material/Delete';

export default {
  title: 'Components/Buttons/FloatingEditorMenuButton',
  component: FloatingEditorMenuButton,
  args: {
    id: 'delete',
    onClick: () => {
      console.log('FloatingEditorMenuIcon clicked');
    },
    icon: <Delete />,
    label: 'text',
    isActive: false,
  },
} as Meta;

export const Default = {};
