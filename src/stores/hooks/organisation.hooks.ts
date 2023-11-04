import {
  createOrganisation,
  fetchOrganisation,
  fetchOrganisations,
  updateOrganisation,
} from '../api/organisation.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateOrganisationDTO,
  Organisation,
  UpdateOrganisationDTO,
} from '../types/organisation.types';

const organisationQueryKey = {
  base: ['organisation'],
  all: ['organisations'],
  one: (organisationId?: string) => [
    ...organisationQueryKey.base,
    { organisationId },
  ],
};

export const useOrganisation = (organisationId?: string) => {
  return useQuery({
    queryKey: organisationQueryKey.one(organisationId),
    queryFn: () => (organisationId ? fetchOrganisation(organisationId) : null),
  });
};

export const useAllOrganisations = () => {
  return useQuery({
    queryKey: organisationQueryKey.all,
    queryFn: fetchOrganisations,
    initialData: [],
  });
};

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (createOrganisationDto: CreateOrganisationDTO) =>
      createOrganisation(createOrganisationDto),
    onSuccess: async (organisation) => {
      await queryClient.setQueryData(
        organisationQueryKey.all,
        (oldOrganisations: Organisation[]) => [
          ...oldOrganisations,
          organisation,
        ],
      );
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
    onSuccess: async (organisation) => {
      await queryClient.setQueryData(
        organisationQueryKey.one(organisation._id),
        organisation,
      );
      await queryClient.setQueryData(
        organisationQueryKey.all,
        (oldOrganisations: Organisation[]) =>
          oldOrganisations.map((oldOrganisation) =>
            oldOrganisation._id === organisation._id
              ? organisation
              : oldOrganisation,
          ),
      );
    },
  });
};
