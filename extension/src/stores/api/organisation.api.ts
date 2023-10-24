import {
  CreateOrganisationDTO,
  Organisation,
  PopulatedOrganisation,
  UpdateOrganisationDTO,
} from '../types/organisation.types';
import { apiRequest } from '@src/utils/api';

export const fetchOrganisation = async (
  organisationId: string,
): Promise<PopulatedOrganisation | null> => {
  try {
    return await apiRequest<PopulatedOrganisation>(
      'GET',
      '/organisation/' + organisationId,
    );
  } catch (error) {
    return null;
  }
};

export const fetchOrganisations = async (): Promise<Organisation[]> => {
  try {
    return await apiRequest<Organisation[]>('GET', '/organisation');
  } catch (error) {
    return [];
  }
};

export const createOrganisation = async (
  createOrganisationDto: CreateOrganisationDTO,
): Promise<Organisation> => {
  return await apiRequest<Organisation>(
    'POST',
    '/organisation',
    undefined,
    createOrganisationDto,
  );
};

export const updateOrganisation = async (
  organisationId: string,
  updateOrganisationDto: UpdateOrganisationDTO,
): Promise<Organisation> => {
  return await apiRequest<Organisation>(
    'PATCH',
    '/organisation/' + organisationId,
    undefined,
    updateOrganisationDto,
  );
};
