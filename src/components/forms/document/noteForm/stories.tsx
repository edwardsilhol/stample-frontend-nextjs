import { Meta } from '@storybook/react';
import NoteForm from './index';

export default {
  title: 'Components/Forms/Document/NoteForm',
  component: NoteForm,
  args: {
    onClose: () => {
      console.log('onClose');
    },
  },
} as Meta;

export const Create = {
  args: {
    variant: 'create',
  },
};

export const Update = {
  args: {
    variant: 'update',
  },
};
