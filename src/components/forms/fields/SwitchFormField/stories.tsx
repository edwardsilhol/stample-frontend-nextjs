import { Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import SwitchFormField from './index';

function Template(args: any) {
  const { control } = useForm<{
    selectedForNewsletter: boolean;
  }>({
    defaultValues: {
      selectedForNewsletter: false,
    },
  });
  return <SwitchFormField control={control} {...args} />;
}
export default {
  title: 'Components/Forms/Fields/SwitchFormField', // Change story title
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
