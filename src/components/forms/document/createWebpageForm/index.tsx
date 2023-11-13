'use client';

import { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Grid, Typography } from '@mui/material';
import { KeyboardArrowLeftOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Tag } from '../../../../stores/types/tag.types';
import { useCreateDocument } from '../../../../stores/hooks/document.hooks';
import TextFormField from '../../fields/textFormField';
import SelectOrCreateTags from '../SelectOrCreateTags';
import { useParams } from 'next/navigation';
import SwitchFormField from '../../fields/SwitchFormField';
import { RouteParams } from '../../../../stores/types/global.types';
import {
  getClippedPageFromUrl,
  isUrlClipable,
} from '../../../../utils/webClipper';
import { CreateDocumentDTO } from '../../../../stores/types/document.types';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type CreateWebpageFormType = Pick<
  CreateDocumentDTO,
  'url' | 'keyInsight' | 'tags' | 'selectedForNewsletter'
>;

interface CreateWepPageFormProps {
  onClose: () => void;
  userHasTeamPrivilege: boolean;
}
function CreateWebpageForm({
  onClose,
  userHasTeamPrivilege,
}: CreateWepPageFormProps) {
  const { teamId } = useParams<RouteParams>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const createDocument = useCreateDocument();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validationSchema = Yup.object().shape({
    url: Yup.string().required(),
    keyInsight: Yup.string().optional(),
    tags: Yup.array().of(Yup.string()),
    selectedForNewsletter: Yup.boolean().optional(),
  } as Record<keyof CreateWebpageFormType, any>);

  const { control, handleSubmit } = useForm<CreateWebpageFormType>({
    defaultValues: {
      keyInsight: '',
      url: '',
      tags: [],
      selectedForNewsletter: false,
    },
    resolver: yupResolver<CreateWebpageFormType>(validationSchema as any),
  });

  const onSubmit = async (values: CreateWebpageFormType) => {
    if (teamId === null) {
      return;
    }
    try {
      setError(undefined);
      const { url, keyInsight, selectedForNewsletter } = values;

      if (await isUrlClipable(url)) {
        const clippedPage = await getClippedPageFromUrl(url);
        await createDocument.mutateAsync({
          teamId: teamId,
          createDocumentDto: {
            keyInsight: keyInsight,
            tags: selectedTags.map((tag) => tag._id),
            selectedForNewsletter,
            type: 'webpage',
            ...clippedPage,
          },
        });
        onClose();
      } else {
        console.log('url is not clipable');
        setError('url is not clipable');
        setOpenSnackbar(true);
      }
    } catch (e: any) {
      setError(e.message);
      setOpenSnackbar(true);
      console.error(e);
    }
  };

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
          Add a link
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
            <SelectOrCreateTags teamId={teamId} onChange={setSelectedTags} />
            {userHasTeamPrivilege && (
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

export default CreateWebpageForm;
