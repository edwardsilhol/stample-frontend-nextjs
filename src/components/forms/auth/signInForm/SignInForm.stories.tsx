import React from 'react';

import { Meta, Story } from '@storybook/react';
import SignInForm from './SignInForm';

export default {
  title: 'SignInForm', // Change story title
  component: SignInForm,
} as Meta;

export const Default: Story = () => (
  <>
    <SignInForm />
  </>
);

Default.args = {};
