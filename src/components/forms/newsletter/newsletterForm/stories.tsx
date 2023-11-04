import { Meta } from '@storybook/react';
import NewsletterForm from './index';

export default {
  title: 'Components/Forms/Newsletter/NewsletterForm',
  component: NewsletterForm,
  args: {
    onClose: () => {
      console.log('onClose');
    },
  },
} as Meta;

export const Default = {};
