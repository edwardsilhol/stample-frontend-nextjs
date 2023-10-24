import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { SignUpDTO } from '../../../../stores/types/user.types';
import { useSignUp } from '../../../../stores/hooks/user.hooks';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import TextFieldForm from '../../fields/textFieldForm';

const useStyles = () => ({
  signUpContainer: {
    my: 8,
    mx: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 8,
  },
  signUpIcon: { m: 1, bgcolor: 'primary.main' },
  fieldContainer: { mt: 1 },
  submitButton: { mt: 3, mb: 2 },
  link: { color: 'additionalColors.link' },
});

interface SignUpFormType extends SignUpDTO {
  confirmPassword: string;
}

function SignUpForm() {
  const signUp = useSignUp();
  const styles = useStyles();
  // TODO: handle errors in form
  const [_, setError] = useState(undefined);

  // TODO: add better validation for your needs
  const validationSchema = Yup.object({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string()
      .equals([Yup.ref('password')], 'Passwords must match')
      .required(),
  } as Record<keyof SignUpFormType, any>);

  const { control, handleSubmit } = useForm<SignUpFormType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(validationSchema) as any,
  });
  const onSubmit = async (values: SignUpFormType) => {
    try {
      setError(undefined);
      const { firstName, lastName, email, password } = values;

      await signUp.mutateAsync({
        firstName,
        lastName,
        email,
        password,
        locale: navigator.language,
      });
    } catch (error: any) {
      setError(error.message);
      console.log(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={styles.signUpContainer}>
        <Avatar sx={styles.signUpIcon}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant={'h5'}>
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={styles.fieldContainer}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextFieldForm
                control={control}
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextFieldForm
                control={control}
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextFieldForm
                control={control}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextFieldForm
                control={control}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextFieldForm
                control={control}
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.submitButton}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/">
                <Typography variant="body2" sx={styles.link}>
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUpForm;
