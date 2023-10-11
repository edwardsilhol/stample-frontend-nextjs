import * as Yup from 'yup';
import { CreateOrganisationDTO } from '../../../stores/types/organisation.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCreateOrganisation } from 'stores/hooks/organisation.hooks';
import TextFieldForm from '../fields/textFieldForm/TextFieldForm';
import { Button } from '@mui/material';
import { useSelectedOrganisationId } from 'stores/data/organisation.data';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

interface CreateOrganisationProps {
  onClose: () => void;
}

function CreateOrganisationForm({ onClose }: CreateOrganisationProps) {
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
    resolver: yupResolver(validationSchema) as any,
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
        <Button type={'submit'}>Save</Button>
      </Stack>
    </Box>
  );
}
export default CreateOrganisationForm;
