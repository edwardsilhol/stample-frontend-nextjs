'use client';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import { Button, Grid, Typography } from '@mui/material';
import { KeyboardArrowLeftOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextFormField from '../../fields/textFormField';
import { useSendNewsletter } from '../../../../stores/hooks/team.hooks';
import { useState, Fragment } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { MinimalDocument } from '../../../../stores/types/document.types';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { TEAM_ROUTE } from '../../../../constants/routes.constant';
import { useUpdateDocument } from '../../../../stores/hooks/document.hooks';

interface NewsletterDocumentsListProps {
  control: Control<NewsletterFormType>;
  teamId: string;
}

function NewsletterDocumentsList({
  control,
  teamId,
}: NewsletterDocumentsListProps) {
  const updateDocument = useUpdateDocument();
  const { fields, remove } = useFieldArray({
    control,
    name: 'documents',
  });
  const handleRemove = async (index: number, id: string) => {
    await updateDocument.mutateAsync({
      documentId: id,
      updateDocumentDto: { selectedForNewsletter: false },
    });
    remove(index);
  };
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: '8px',
      }}
    >
      <CardContent
        sx={{
          padding: '0 !important',
          margin: 0,
        }}
      >
        {fields.length === 0 ? (
          <Alert severity="error">
            You must at least choose one document. Visit the :{' '}
            <Link
              href={`${TEAM_ROUTE}/${teamId}`}
              color="primary"
              style={{
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              team page
            </Link>
          </Alert>
        ) : (
          <List>
            {fields.map((item, index) => (
              <Fragment key={index}>
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemove(index, item._id)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText>
                    <Typography
                      variant="body1"
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '500px',
                      }}
                    >
                      {item.title}
                    </Typography>
                  </ListItemText>
                </ListItem>
                {index < fields.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

interface NewsletterFormType {
  title: string;
  intro: string;
  conclusion: string;
  documents: MinimalDocument[];
}
interface NewsletterFormProps {
  teamId: string;
  documents: MinimalDocument[];
}
function NewsletterForm({ teamId, documents }: NewsletterFormProps) {
  const router = useRouter();
  const sendNewsletter = useSendNewsletter(teamId);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    intro: Yup.string().required(),
    conclusion: Yup.string().required(),
    documents: Yup.array().required().min(1),
  } as Record<keyof NewsletterFormType, any>);

  const { control, handleSubmit, reset } = useForm<NewsletterFormType>({
    defaultValues: {
      title: '',
      intro: '',
      conclusion: '',
      documents: documents.filter((document) => document.selectedForNewsletter),
    },
    resolver: yupResolver<NewsletterFormType>(validationSchema as any),
  });

  const onSubmit = async ({ title, intro, conclusion }: NewsletterFormType) => {
    setIsLoading(true);
    sendNewsletter.mutate({
      teamId,
      sendNewsletterDto: {
        title,
        intro,
        conclusion,
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpenSnackbar(true);
    setIsLoading(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOpenSnackbar(false);
    reset({
      title: '',
      intro: '',
      conclusion: '',
      documents: [],
    });
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
              Select documents
            </Typography>
            <NewsletterDocumentsList control={control} teamId={teamId} />
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
