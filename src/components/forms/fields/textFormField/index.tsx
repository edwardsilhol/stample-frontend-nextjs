import TextField, { TextFieldProps } from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { Control, useController, UseControllerProps } from 'react-hook-form';

interface Props extends UseControllerProps {
  control: Control<any>;
}

function TextFormField({
  name,
  control,
  rules,
  shouldUnregister,
  defaultValue,
  ...props
}: Props & TextFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules, shouldUnregister, defaultValue });

  return (
    <Tooltip title={error?.message || ''}>
      <TextField {...field} error={!!error} {...props} />
    </Tooltip>
  );
}

export default TextFormField;
