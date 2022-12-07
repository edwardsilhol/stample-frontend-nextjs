import React, { FC } from 'react';
import { TextField, TextFieldProps, Tooltip } from '@mui/material';
import { Control, useController, UseControllerProps } from 'react-hook-form';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  textField: {},
  inputLabel: {},
});

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
  const classes = useStyles();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules, shouldUnregister, defaultValue });

  return (
    <Tooltip title={error?.message || ''}>
      <TextField
        {...field}
        error={!!error}
        {...props}
        className={classes.textField}
        InputLabelProps={{
          className: classes.inputLabel,
        }}
      />
    </Tooltip>
  );
};
