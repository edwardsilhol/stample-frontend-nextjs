import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useSignIn } from '../../../stores/hooks/user.hooks';
import * as Yup from 'yup';
import { SignInDTO } from '../../../stores/types/user.types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextFieldForm } from '../fields/TextFieldForm';
import Link from 'next/link';

const useStyles = () => ({
  leftContainer: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  signInContainer: {
    my: 8,
    mx: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signInIcon: { m: 1, bgcolor: 'additionalColors.additionalMain' },
  fieldContainer: { mt: 1 },
  submitButton: { mt: 3, mb: 2 },
  link: { color: 'additionalColors.link' },
});

function SignInForm() {
  const signIn = useSignIn();
  const classes = useStyles();
  // TODO: handle errors in form
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      await signIn.mutateAsync({
        email: values.email,
        password: values.password,
      });
    } catch (error: any) {
      setError(error.message);
      console.log(error.message);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={false} sm={false} md={8} sx={classes.leftContainer} />
      <Grid item xs={12} sm={12} md={4} component={Paper} elevation={6} square>
        <Box sx={classes.signInContainer}>
          <Avatar sx={classes.signInIcon}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={classes.fieldContainer}
          >
            <TextFieldForm
              control={control}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextFieldForm
              control={control}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={classes.submitButton}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/">Forgot password?</Link>
                {/* TODO: add forgot password page*/}
              </Grid>
              <Grid item>
                <Link href="/signUp">
                  <Typography variant="body2" sx={classes.link}>
                    {"Don't have an account? Sign Up"}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignInForm;
