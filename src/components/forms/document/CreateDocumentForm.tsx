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
import { Button } from '@mui/material';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';

export const CreateDocumentForm: React.FC = () => {
  // TODO: handle errors in form
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState(undefined);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty(),
  );
  const createDocument = useCreateDocument();

  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    content: Yup.string().required(),
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
    try {
      setError(undefined);
      const { title, summary, url, type } = values;

      await createDocument.mutateAsync({
        title,
        content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        summary,
        url,
        tags: selectedTags.map((tag) => tag._id),
        type,
      });
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextFieldForm
        control={control}
        name={'title'}
        required
        fullWidth
        id={'title'}
        label={'Title'}
        autoFocus
      />
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
      />
      <TextFieldForm
        control={control}
        name={'summary'}
        required
        fullWidth
        id={'summary'}
        label={'Summary'}
        multiline
      />
      <TextFieldForm
        control={control}
        name={'url'}
        required
        fullWidth
        id={'url'}
        label={'URL'}
      />
      <SelectOrCreateTags onChange={setSelectedTags} />
      <Button type={'submit'}>Submit</Button>
    </Box>
  );
};
