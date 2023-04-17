import React from 'react';
import * as Yup from 'yup';
import { CreateOrganisationDTO } from '../../../stores/types/organisation.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCreateOrganisation } from 'stores/hooks/organisation.hooks';
import Box from '../../muiOverrides/Box';
import { TextFieldForm } from '../fields/TextFieldForm';
import { Button } from '@mui/material';
import Stack from '../../muiOverrides/Stack';
import { useSelectedOrganisationId } from 'stores/data/organisation.data';
interface Props {
  onClose: () => void;
}

export const CreateOrganisationForm: React.FC<Props> = ({ onClose }) => {
  const createOrganisation = useCreateOrganisation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSelectedOrganisationId] = useSelectedOrganisationId();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  } as Record<keyof CreateOrganisationDTO, any>);

  const { control, handleSubmit } = useForm<CreateOrganisationDTO>({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: CreateOrganisationDTO) => {
    try {
      const { name } = values;

      await createOrganisation
        .mutateAsync({
          name,
          active: true,
        })
        .then((organisation) => {
          setSelectedOrganisationId(organisation._id);
          onClose();
        });
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stack
        direction={'column'}
        spacing={2}
        sx={{
          margin: '16px',
        }}
      >
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
