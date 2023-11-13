import { Meta } from '@storybook/react';
import CreateNoteForm from './index';

export default {
  title: 'Components/Forms/Document/CreateDocumentForm',
  component: CreateNoteForm,
  args: {
    onClose: () => {
      console.log('onClose');
    },
  },
} as Meta;

export const Default = {};
