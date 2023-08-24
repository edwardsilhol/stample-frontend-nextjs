import React, { useState } from 'react';
import * as Yup from 'yup';
import { CreateDocumentDTO } from '../../../stores/types/document.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCreateDocument } from '../../../stores/hooks/document.hooks';
import Box from '../../muiOverrides/Box';
import { TextFieldForm } from '../fields/TextFieldForm';
import SelectOrCreateTags from './SelectOrCreateTags';
import { Tag } from '../../../stores/types/tag.types';
import { Button, Grid, Typography } from '@mui/material';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'draft-js/dist/Draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Stack from '../../muiOverrides/Stack';
import { useSelectedTeamId } from '../../../stores/data/team.data';
import { KeyboardArrowLeftOutlined } from '@mui/icons-material';

interface Props {
  onClose: () => void;
}

export const CreateDocumentForm: React.FC<Props> = ({ onClose }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState(undefined);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty(),
  );
  const [selectedTeamId] = useSelectedTeamId();
  const createDocument = useCreateDocument();

  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

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
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: CreateDocumentDTO) => {
    if (selectedTeamId === null) {
      return;
    }
    try {
      setError(undefined);
      const { title, summary, url, type } = values;

      await createDocument
        .mutateAsync({
          teamId: selectedTeamId,
          createDocumentDto: {
            title,
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
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
              Summary
            </Typography>
            <TextFieldForm
              control={control}
              name="summary"
              required
              fullWidth
              id="summary"
              placeholder="Give a summary to your note"
              multiline
            />
            <Typography variant="body2" fontWeight={500}>
              Content
            </Typography>
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorStateChange}
              editorStyle={{
                height: '136px',
                backgroundColor: 'white',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.23)',
                borderRadius: '8px',
                paddingLeft: '14px',
                paddingTop: '0.5px',
                paddingBottom: '0.5px',
              }}
              toolbarStyle={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: 0,
                marginLeft: '-4px',
              }}
              placeholder="The content of your note"
              toolbar={{
                options: ['inline', 'list'],
                inline: {
                  options: ['bold', 'italic', 'underline'],
                },
                list: {
                  options: ['unordered', 'ordered'],
                },
              }}
            />
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
            <SelectOrCreateTags onChange={setSelectedTags} />
            <Button type="submit" variant="contained" sx={{ alignSelf: 'end' }}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={2} />
    </Grid>
  );
};
