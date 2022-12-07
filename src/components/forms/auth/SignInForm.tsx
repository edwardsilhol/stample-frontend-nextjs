import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { createUseStyles } from 'react-jss';
import { TextFieldForm } from '../fields/TextFieldForm';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSignIn } from '../../../stores/hooks/user.hooks';
import { SignInDTO } from '../../../stores/types/user.types';

const useStyles = createUseStyles({
  fieldContainer: {},
  error: {
    // TODO : useTheme
    color: 'red',
  },
});

function SignInForm() {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: signInMutateAsync, isLoading: isSignInLoading } =
    useSignIn();
  const [error, setError] = useState(undefined);

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  } as Record<keyof SignInDTO, any>);

  const { control, handleSubmit } = useForm<SignInDTO>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: SignInDTO) => {
    try {
      setError(undefined);
      await signInMutateAsync({
        email: values.email,
        password: values.password,
      });
    } catch (error: any) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={'18px'} direction="column">
        <Stack
          spacing={'18px'}
          direction="column"
          className={classes.fieldContainer}
        >
          <TextFieldForm name="email" control={control} label={'email'} />
          <TextFieldForm
            name="password"
            control={control}
            type={showPassword ? 'text' : 'password'}
            label={'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSignInLoading}
        >
          {'logIn'}
        </LoadingButton>
        {error && (
          <Typography variant="h5" className={classes.error}>
            {error}
          </Typography>
        )}
      </Stack>
    </form>
  );
}

export default SignInForm;
