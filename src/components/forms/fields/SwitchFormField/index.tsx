import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Control, useController, UseControllerProps } from 'react-hook-form';

interface SwitchFieldFormProps extends UseControllerProps {
  control: Control<any>;
  label: string;
}

function SwitchFormField({
  name,
  control,
  rules,
  shouldUnregister,
  defaultValue,
  label,
  ...props
}: SwitchFieldFormProps) {
  const { field } = useController({
    name,
    control,
    rules,
    shouldUnregister,
    defaultValue,
  });

  return (
    <FormControlLabel
      {...field}
      {...props}
      control={<Switch />}
      label={label}
    />
  );
}

export default SwitchFormField;
