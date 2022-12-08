import React, { FC } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { Control, useController, UseControllerProps } from 'react-hook-form';

interface Props extends UseControllerProps {
  control: Control<any>;
}

export const TextFieldForm: FC<Props & TextFieldProps> = ({
  name,
  control,
  rules,
  shouldUnregister,
  defaultValue,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules, shouldUnregister, defaultValue });

  return (
    <Tooltip title={error?.message || ''}>
      <TextField {...field} error={!!error} {...props} />
    </Tooltip>
  );
};
