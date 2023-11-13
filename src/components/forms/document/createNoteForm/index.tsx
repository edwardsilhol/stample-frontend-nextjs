'use client';

import { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, Grid, Typography } from '@mui/material';
import { KeyboardArrowLeftOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CreateDocumentDTO } from '../../../../stores/types/document.types';
import { Tag } from '../../../../stores/types/tag.types';
import { useCreateDocument } from '../../../../stores/hooks/document.hooks';
import TextFormField from '../../fields/textFormField';
import SelectOrCreateTags from '../SelectOrCreateTags';
import TextEditor from '../../fields/TextEditor';
import { useEditor } from '../../fields/TextEditor/hooks/useEditor';
import { useParams } from 'next/navigation';
import SwitchFormField from '../../fields/SwitchFormField';
import { RouteParams } from '../../../../stores/types/global.types';

interface CreateNoteFormProps {
  onClose: () => void;
}
function CreateNoteForm({ onClose }: CreateNoteFormProps) {
  const { teamId } = useParams<RouteParams>();
  const [_, setError] = useState(undefined);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const createDocument = useCreateDocument();
  const editor = useEditor({
    placeholder: 'The content of your note',
    editorStyle: {
      height: '136px',
      overflow: 'auto',
    },
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    content: Yup.string().optional(),
    summary: Yup.string().optional(),
    url: Yup.string().optional(),
    tags: Yup.array().of(Yup.string()),
  } as Record<keyof CreateDocumentDTO, any>);

  const { control, handleSubmit } = useForm<CreateDocumentDTO>({
    defaultValues: {
      title: '',
      content: '',
      summary: '',
      url: '',
      tags: [],
      type: 'note',
      selectedForNewsletter: false,
    },
    resolver: yupResolver<CreateDocumentDTO>(validationSchema as any),
  });

  const onSubmit = async (values: CreateDocumentDTO) => {
    if (teamId === null) {
      return;
    }
    try {
      setError(undefined);
      const { title, summary, url, type, selectedForNewsletter } = values;

      await createDocument.mutateAsync({
        teamId: teamId,
        createDocumentDto: {
          title,
          content: editor?.getHTML() || '',
          keyInsight: summary,
          summary,
          url,
          tags: selectedTags.map((tag) => tag._id),
          type,
          selectedForNewsletter,
        },
      });
      onClose();
    } catch (e: any) {
      setError(e.message);
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
          Add a note
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
              placeholder="Give a title to your note"
              autoFocus
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
              Content
            </Typography>
            <TextEditor editor={editor} />
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
              Tags
            </Typography>
            <SelectOrCreateTags teamId={teamId} onChange={setSelectedTags} />
            <SwitchFormField
              control={control}
              label="Select for newsletter"
              name="selectedForNewsletter"
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: 'end' }}>
              Save
            </Button>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={2} />
    </Grid>
  );
}

export default CreateNoteForm;
