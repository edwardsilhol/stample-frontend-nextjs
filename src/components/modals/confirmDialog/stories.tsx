import { Meta } from '@storybook/react';
import ConfirmDialog from './index';

export default {
  title: 'Components/Modals/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    open: true,
    title: 'Confirm Action',
    content: 'Are you sure you want to proceed?',
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled'),
  },
} as Meta;

export const Default = {};
