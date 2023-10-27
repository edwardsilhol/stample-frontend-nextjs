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
import TextFieldForm from '../../fields/textFieldForm';
import SelectOrCreateTags from '../SelectOrCreateTags';
import TextEditor from '../../fields/TextEditor';
import { useEditor } from '../../fields/TextEditor/hooks/useEditor';
import { useParams } from 'next/navigation';

interface CreateDocumentFormProps {
  onClose: () => void;
}
function CreateDocumentForm({ onClose }: CreateDocumentFormProps) {
  const { teamId } = useParams();
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
    summary: Yup.string().required(),
    url: Yup.string().required(),
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
    },
    resolver: yupResolver(validationSchema) as any,
  });

  const onSubmit = async (values: CreateDocumentDTO) => {
    if (teamId === null) {
      return;
    }
    try {
      setError(undefined);
      const { title, summary, url, type } = values;

      await createDocument
        .mutateAsync({
          teamId: teamId as string,
          createDocumentDto: {
            title,
            content: editor?.getHTML() || '',
            summary,
            url,
            tags: selectedTags.map((tag) => tag._id),
            type,
          },
        })
        .then(() => {
          onClose();
        });
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    }
  };

  return (
    <Grid container paddingTop={8} paddingX={3.5}>
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
            <TextFieldForm
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
            <TextFieldForm
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
            {/*<Editor*/}
            {/*  editorState={editorState}*/}
            {/*  onEditorStateChange={handleEditorStateChange}*/}
            {/*  editorStyle={{*/}
            {/*    height: '136px',*/}
            {/*    backgroundColor: 'white',*/}
            {/*    border: '1px solid',*/}
            {/*    borderColor: 'rgba(0, 0, 0, 0.23)',*/}
            {/*    borderRadius: '8px',*/}
            {/*    paddingLeft: '14px',*/}
            {/*    paddingTop: '0.5px',*/}
            {/*    paddingBottom: '0.5px',*/}
            {/*  }}*/}
            {/*  toolbarStyle={{*/}
            {/*    backgroundColor: 'transparent',*/}
            {/*    border: 'none',*/}
            {/*    padding: 0,*/}
            {/*    marginLeft: '-4px',*/}
            {/*  }}*/}
            {/*  placeholder="The content of your note"*/}
            {/*  toolbar={{*/}
            {/*    options: ['inline', 'list'],*/}
            {/*    inline: {*/}
            {/*      options: ['bold', 'italic', 'underline'],*/}
            {/*    },*/}
            {/*    list: {*/}
            {/*      options: ['unordered', 'ordered'],*/}
            {/*    },*/}
            {/*  }}*/}
            {/*/>*/}
            <TextEditor editor={editor} />
            <Typography variant="body2" fontWeight={500}>
              Url
            </Typography>
            <TextFieldForm
              control={control}
              name="url"
              required
              fullWidth
              id="url"
              placeholder="Give a url to your note"
            />
            <Typography variant="body2" fontWeight={500}>
              Tags
            </Typography>
            <SelectOrCreateTags
              teamId={teamId as string}
              onChange={setSelectedTags}
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

export default CreateDocumentForm;
