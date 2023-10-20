import {
  createOrganisation,
  fetchOrganisation,
  fetchOrganisations,
  updateOrganisation,
} from '../../api/organisation.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateOrganisationDTO,
  UpdateOrganisationDTO,
} from '../../types/organisation.types';

export const useOrganisation = (organisationId: string | null) => {
  return useQuery({
    queryKey: ['organisation', { organisationId }],
    queryFn: () => (organisationId ? fetchOrganisation(organisationId) : null),
  });
};

export const useAllOrganisations = () => {
  return useQuery({
    queryKey: ['allOrganisations'],
    queryFn: fetchOrganisations,
    initialData: [],
  });
};

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (createOrganisationDto: CreateOrganisationDTO) =>
      createOrganisation(createOrganisationDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['allOrganisations'] });
    },
  });
};

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organisationId,
      updateOrganisationDto,
    }: {
      organisationId: string;
      updateOrganisationDto: UpdateOrganisationDTO;
    }) => updateOrganisation(organisationId, updateOrganisationDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['allOrganisations'] });
    },
  });
};
