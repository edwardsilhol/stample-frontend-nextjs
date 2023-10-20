import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextFieldForm from '../../fields/TextFieldForm';
import Container from '@mui/material/Container';
import { Link } from '@mui/material';
import { SignInDTO } from '@src/stores/types/user.types';
import { useSignIn } from '@src/stores/hooks/tanstackQuery/user.hooks';

const useStyles = () => ({
  signInContainer: {
    my: 8,
    mx: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signInIcon: { m: 1, bgcolor: 'primary.main' },
  fieldContainer: { mt: 1 },
  submitButton: { mt: 3, mb: 2 },
  link: { color: 'additionalColors.link' },
});

function SignInForm() {
  const signIn = useSignIn();
  const styles = useStyles();
  // TODO: handle errors in form
  const [_, setError] = useState(undefined);

  // TODO: add better validation for your needs
  const validationSchema: Yup.ObjectSchema<SignInDTO> = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const { control, handleSubmit } = useForm<SignInDTO>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(validationSchema) as any,
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
    <Container component="main" maxWidth="sm">
      <Box sx={styles.signInContainer}>
        <Avatar sx={styles.signInIcon}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={styles.fieldContainer}
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
            sx={styles.submitButton}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/">
                <Typography variant="body2" sx={styles.link}>
                  Forgot password?
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signUp">
                <Typography variant="body2" sx={styles.link}>
                  {"Don't have an account? Sign Up"}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignInForm;
