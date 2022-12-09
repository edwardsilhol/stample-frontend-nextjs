import React from 'react';

import { Meta, Story } from '@storybook/react';
import SignUpForm from './SignUpForm';

export default {
  title: 'Components/SignUpForm', // Change story title
  component: SignUpForm,
} as Meta;

export const Default: Story = () => (
  <>
    <SignUpForm />
  </>
);

Default.args = {};
