import { Meta } from '@storybook/react';
import FloatingEditorMenuButton from './index';
import Delete from '@mui/icons-material/Delete';
import TitleTwoToneIcon from '@mui/icons-material/TitleTwoTone';
import SubtitlesTwoToneIcon from '@mui/icons-material/SubtitlesTwoTone';

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

export const Active = {
  args: {
    isActive: true,
  },
};

export const WithSubButtons = {
  args: {
    subButtons: [
      {
        id: 'h1',
        icon: <TitleTwoToneIcon fontSize="small" />,
        label: 'h1',
        onClick: () => {
          console.log(' clicked h1');
        },
        isActive: false,
      },
      {
        id: 'h2',
        label: 'h2',
        icon: <SubtitlesTwoToneIcon fontSize="small" />,
        onClick: () => {
          console.log(' clicked h2');
        },
        isActive: false,
      },
    ],
  },
};
