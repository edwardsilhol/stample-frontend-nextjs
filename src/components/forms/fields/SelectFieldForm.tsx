import React, { ReactNode } from 'react';
import {
  MenuItem,
  MenuItemProps,
  TextField,
  TextFieldProps,
  Tooltip,
} from '@mui/material';
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

interface Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  options?: (MenuItemProps & { label: ReactNode | string })[];
  allowNoSelection?: boolean;
  noSelectionText?: string;
}

export const SelectFieldForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  shouldUnregister,
  defaultValue,
  allowNoSelection,
  noSelectionText,
  options,
  children,
  ...props
}: Props<TFieldValues, TName> & TextFieldProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules, shouldUnregister, defaultValue });

  return (
    <Tooltip title={error?.message || ''} placement="top">
      <TextField
        {...field}
        {...props}
        value={field.value || field.value === 0 ? field.value : ''}
        error={!!error}
        select
        SelectProps={{
          displayEmpty: allowNoSelection,
        }}
      >
        {options
          ? [
              Boolean(allowNoSelection && options) ? (
                <MenuItem value="" key={0}>
                  <em>{noSelectionText || 'Sélectionner'}</em>
                </MenuItem>
              ) : null,
              ...options.map(({ label, ...menuItemProps }, index) => (
                <MenuItem key={index + 1} {...menuItemProps}>
                  {label}
                </MenuItem>
              )),
            ]
          : children
          ? children
          : [
              <MenuItem value="" key={0}>
                <em>{noSelectionText || 'Sélectionner'}</em>
              </MenuItem>,
            ]}
      </TextField>
    </Tooltip>
  );
};
