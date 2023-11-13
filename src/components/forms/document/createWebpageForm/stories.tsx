import { Meta } from '@storybook/react';
import CreateWebpageForm from './index';

export default {
  title: 'Components/Forms/Document/CreateDocumentFromLinkForm',
  component: CreateWebpageForm,
  args: {
    onClose: () => {
      console.log('onClose');
    },
  },
} as Meta;

export const Default = {};
