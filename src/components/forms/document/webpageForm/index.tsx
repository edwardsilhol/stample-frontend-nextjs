'use client';

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Grid, Typography } from '@mui/material';
import { KeyboardArrowLeftOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Tag } from '../../../../stores/types/tag.types';
import {
  useCreateDocument,
  useUpdateDocument,
} from '../../../../stores/hooks/document.hooks';
import TextFormField from '../../fields/textFormField';
import DocumentTagsTextField from '../documentTagsTextField';
import { useParams } from 'next/navigation';
import SwitchFormField from '../../fields/SwitchFormField';
import { RouteParams } from '../../../../stores/types/global.types';
import {
  getClippedPageFromUrl,
  isUrlClipable,
} from '../../../../utils/webClipper';
import {
  CreateDocumentDTO,
  PopulatedDocument,
} from '../../../../stores/types/document.types';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type WebpageFormType = Pick<
  CreateDocumentDTO,
  'url' | 'summary' | 'tags' | 'selectedForNewsletter'
>;

interface WepPageFormProps {
  variant: 'create' | 'update';
  onClose: () => void;
  userHasTeamPrivilege: boolean;
  isPersonalTeam: boolean;
  document?: PopulatedDocument;
}
function WebpageForm({
  variant,
  onClose,
  userHasTeamPrivilege,
  isPersonalTeam,
  document,
}: WepPageFormProps) {
  const { teamId } = useParams<RouteParams>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validationSchema = Yup.object().shape({
    url: Yup.string().url().required(),
    summary: Yup.string().optional(),
    tags: Yup.array().of(Yup.string()),
    selectedForNewsletter: Yup.boolean().optional(),
  } as Record<keyof WebpageFormType, any>);

  useEffect(() => {
    if (document) {
      setSelectedTags(document.tags);
    }
  }, [document]);

  const { control, handleSubmit } = useForm<WebpageFormType>({
    defaultValues: {
      summary: '',
      url: '',
      selectedForNewsletter: false,
      ...(variant === 'update' && document ? document : {}),
      tags: [],
    },
    resolver: yupResolver<WebpageFormType>(validationSchema as any),
  });

  const onSubmit = async (values: WebpageFormType) => {
    if (teamId === null) {
      return;
    }
    try {
      setError(undefined);
      const { url, summary, selectedForNewsletter } = values;

      if (variant === 'create') {
        if (await isUrlClipable(url)) {
          const clippedPage = await getClippedPageFromUrl(url);
          await createDocument.mutateAsync({
            teamId: teamId,
            createDocumentDto: {
              ...clippedPage,
              tags: selectedTags.map((tag) => tag._id),
              selectedForNewsletter,
              type: 'webpage',
              summary,
            },
          });
        } else {
          console.log('url is not clipable');
          setError('url is not clipable');
          setOpenSnackbar(true);
        }
      } else if (document) {
        await updateDocument.mutateAsync({
          documentId: document?._id,
          updateDocumentDto: {
            summary,
            tags: selectedTags.map((tag) => tag._id),
            selectedForNewsletter,
          },
        });
      }
      onClose();
    } catch (e: any) {
      setError(e.message);
      setOpenSnackbar(true);
      console.error(e);
    }
  };

  if (variant === 'update' && !document)
    throw Error('document is undefined for variant update');

  return (
    <Grid container paddingTop={8} paddingX={3.5} paddingBottom="20px">
      <Grid item xs={2}>
        <Button
          onClick={onClose}
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
          {variant === 'update' ? 'Update' : 'Create'} link
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2" fontWeight={500}>
              Url
            </Typography>
            <TextFormField
              control={control}
              name="url"
              fullWidth
              id="url"
              placeholder="Give a url to your note"
              disabled={variant === 'update'}
            />
            <Typography variant="body2" fontWeight={500}>
              Key insight
            </Typography>
            <TextFormField
              control={control}
              name="summary"
              required
              fullWidth
              id="summary"
              placeholder="Add your insights"
              multiline
            />
            <Typography variant="body2" fontWeight={500}>
              Tags
            </Typography>
            <DocumentTagsTextField
              teamId={teamId}
              onChange={setSelectedTags}
              value={selectedTags}
            />
            {userHasTeamPrivilege && !isPersonalTeam && (
              <SwitchFormField
                control={control}
                label="Select for newsletter"
                name="selectedForNewsletter"
              />
            )}
            <Button type="submit" variant="contained" sx={{ alignSelf: 'end' }}>
              Save
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
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default WebpageForm;
