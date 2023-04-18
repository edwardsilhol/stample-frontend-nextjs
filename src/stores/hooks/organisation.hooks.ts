import {
  createOrganisation,
  fetchOrganisation,
  fetchOrganisations,
  updateOrganisation,
} from '../api/organisation.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateOrganisationDTO,
  UpdateOrganisationDTO,
} from '../types/organisation.types';

export const useOrganisation = (organisationId: string | null) => {
  return useQuery(['organisation', { organisationId }], () =>
    organisationId ? fetchOrganisation(organisationId) : null,
  );
};

export const useAllOrganisations = () => {
  return useQuery(['allOrganisations'], fetchOrganisations, {
    initialData: [],
  });
};

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (createOrganisationDto: CreateOrganisationDTO) =>
      createOrganisation(createOrganisationDto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['allOrganisations']);
      },
    },
  );
};

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      organisationId,
      updateOrganisationDto,
    }: {
      organisationId: string;
      updateOrganisationDto: UpdateOrganisationDTO;
    }) => updateOrganisation(organisationId, updateOrganisationDto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['allOrganisations']);
      },
    },
  );
};
