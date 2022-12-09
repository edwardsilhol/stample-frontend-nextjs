import { Meta, Story } from '@storybook/react';
import React from 'react';

import SignInForm from './SignInForm';

export default {
  title: 'Components/SignInForm', // Change story title
  component: SignInForm,
} as Meta;

export const Default: Story = () => (
  <>
    <SignInForm />
  </>
);

Default.args = {};
