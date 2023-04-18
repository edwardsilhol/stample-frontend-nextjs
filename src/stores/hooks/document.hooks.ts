import {
  createDocument,
  fetchDocument,
  fetchDocumentsByTag,
  fetchDocuments,
  updateDocumentAsGuest,
  fetchDocumentsByTeam,
} from '../api/document.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateDocumentDTO,
  UpdateDocumentAsGuestDTO,
} from '../types/document.types';
import { useSelectedTeamId } from 'stores/data/team.data';

export const useDocument = (documentId: string) => {
  return useQuery(['document', { documentId }], () =>
    fetchDocument(documentId),
  );
};

export const useDocumentByTag = (tag: string) => {
  return useQuery(['documentByTag', { tag }], () => fetchDocumentsByTag(tag), {
    initialData: [],
  });
};

export const useAllDocuments = () => {
  return useQuery(['allDocuments'], fetchDocuments, {
    initialData: [],
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (createDocumentDto: CreateDocumentDTO) => createDocument(createDocumentDto),
    {
      onSuccess: ({ team }) => {
        queryClient.invalidateQueries(['documents', { teamId: team }]);
      },
    },
  );
};

export const useUpdateDocumentAsGuest = (documentId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (updateDocumentAsGuestDTO: UpdateDocumentAsGuestDTO) =>
      updateDocumentAsGuest(documentId, updateDocumentAsGuestDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['document', { documentId }]);
      },
    },
  );
};

export const useDocumentsByTeam = (teamId: string | null) => {
  return useQuery(
    ['documents', { teamId }],
    () => {
      if (teamId) {
        return fetchDocumentsByTeam(teamId);
      }
      return [];
    },
    {
      initialData: [],
    },
  );
};

export const useDocumentsBySelectedTeam = () => {
  const [selectedTeamId] = useSelectedTeamId();
  return useDocumentsByTeam(selectedTeamId);
};
