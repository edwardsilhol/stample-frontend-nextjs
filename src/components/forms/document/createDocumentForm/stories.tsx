import { Meta } from '@storybook/react';
import CreateDocumentForm from './index';

export default {
  title: 'Components/Forms/Document/CreateDocumentForm', // Change story title
  component: CreateDocumentForm,
  args: {
    onClose: () => {
      console.log('onClose');
    },
  },
} as Meta;

export const Default = {};
