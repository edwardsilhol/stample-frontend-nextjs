import { Meta } from '@storybook/react';
import WebpageForm from './index';

export default {
  title: 'Components/Forms/Document/WebpageForm',
  component: WebpageForm,
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
