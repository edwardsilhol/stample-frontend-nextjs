import React from 'react';
import * as Yup from 'yup';
import { CreateTeamDTO } from '../../../stores/types/team.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCreateTeam } from '../../../stores/hooks/team.hooks';
import Box from '../../muiOverrides/Box';
import { TextFieldForm } from '../fields/TextFieldForm';
import { Button } from '@mui/material';
import 'draft-js/dist/Draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Stack from '../../muiOverrides/Stack';
const useStyles = () => ({
  container: {
    margin: '16px',
  },
  editorContainer: {
    height: '300px',
  },
});
interface Props {
  onClose: () => void;
}

export const CreateTeamForm: React.FC<Props> = ({ onClose }) => {
  const styles = useStyles();
  const createTeam = useCreateTeam();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  } as Record<keyof CreateTeamDTO, any>);

  const { control, handleSubmit } = useForm<CreateTeamDTO>({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: CreateTeamDTO) => {
    try {
      const { name } = values;

      await createTeam
        .mutateAsync({
          name,
          tags: [],
        })
        .then(() => {
          onClose();
        });
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={'column'} spacing={2} sx={styles.container}>
        <TextFieldForm
          control={control}
          name="name"
          label="Name"
          fullWidth
          required
        />
        <Button type={'submit'}>Submit</Button>
      </Stack>
    </Box>
  );
};
