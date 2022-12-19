import React from 'react';

import { Meta, Story } from '@storybook/react';
import { TextFieldForm } from './TextFieldForm';
import { useForm } from 'react-hook-form';

export default {
  title: 'Components/Forms/Fields/TextFieldForm', // Change story title
  component: TextFieldForm,
  argsTypes: {
    label: { control: 'text' },
  },
} as Meta;

export const Default: Story = (args: any) => {
  const { control } = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: '',
    },
  });
  return <TextFieldForm control={control} {...args} />;
};

Default.args = {
  label: 'label',
  name: 'name',
};
