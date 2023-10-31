'use client';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Grid, Typography } from '@mui/material';
import { KeyboardArrowLeftOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextFormField from '../../fields/textFormField';
import { useSendNewsletter } from '../../../../stores/hooks/team.hooks';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';

interface NewsletterFormType {
  title: string;
  intro: string;
  conclusion: string;
}
interface NewsletterFormProps {
  teamId: string;
}
function NewsletterForm({ teamId }: NewsletterFormProps) {
  const router = useRouter();
  const sendNewsletter = useSendNewsletter();
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    intro: Yup.string().required(),
    conclusion: Yup.string().required(),
  } as Record<keyof NewsletterFormType, any>);

  const { control, handleSubmit } = useForm<NewsletterFormType>({
    defaultValues: {
      title: '',
      intro: '',
      conclusion: '',
    },
    resolver: yupResolver<NewsletterFormType>(validationSchema as any),
  });

  const onSubmit = async (values: NewsletterFormType) => {
    console.log(values);

    setIsLoading(true);
    sendNewsletter.mutate({
      teamId,
      sendNewsletterDto: values,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpenSnackbar(true);
    setIsLoading(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpenSnackbar(false);
  };

  return (
    <Grid container paddingTop={8} paddingX={3.5}>
      <Grid item xs={2}>
        <Button
          onClick={() => router.back()}
          startIcon={<KeyboardArrowLeftOutlined />}
          sx={{
            color: 'black',
            textTransform: 'none',
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            Back
          </Typography>
        </Button>
      </Grid>

      <Grid item xs={8}>
        <Typography
          variant="h1"
          textAlign="center"
          fontSize="2.4rem"
          paddingBottom={5}
        >
          Newsletter
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2" fontWeight={500}>
              Title
            </Typography>
            <TextFormField
              control={control}
              name="title"
              required
              fullWidth
              id="title"
              placeholder="Give a title to your newsletter"
              autoFocus
            />
            <Typography variant="body2" fontWeight={500}>
              Intro
            </Typography>
            <TextFormField
              control={control}
              name="intro"
              required
              fullWidth
              id="intro"
              placeholder="Add your intro"
              multiline
            />
            <Typography variant="body2" fontWeight={500}>
              Conclusion
            </Typography>
            <TextFormField
              control={control}
              name="conclusion"
              fullWidth
              id="conclusion"
              placeholder="Give a conclusion"
            />
            <Typography variant="body2" fontWeight={500}>
              Notes // TODO
            </Typography>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{ alignSelf: 'end' }}
            >
              Send newsletter
            </Button>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={2} />
      {/* TODO change when snackbar provider is created */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          This is a success message!
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default NewsletterForm;
