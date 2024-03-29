import { Meta } from '@storybook/react';
import TextFormField from './index';
import { useForm } from 'react-hook-form';

function Template(args: any) {
  const { control } = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: '',
    },
  });
  return <TextFormField control={control} {...args} />;
}
export default {
  title: 'Components/Forms/Fields/TextFieldForm', // Change story title
  render: Template,
  argsTypes: {
    label: { control: 'text' },
  },
} as Meta;

export const Default = {
  args: {
    label: 'label',
    name: 'name',
  },
};
