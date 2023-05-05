import {
  createDocument,
  fetchDocument,
  updateDocumentAsGuest,
  fetchDocumentsByTeam,
  searchDocuments,
} from '../api/document.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateDocumentDTO,
  SearchDocumentsDTO,
  UpdateDocumentAsGuestDTO,
} from '../types/document.types';
import { useSelectedTeamId } from 'stores/data/team.data';

export const useDocument = (teamId: string | null, documentId: string) => {
  return useQuery(['document', { documentId }], () => {
    if (teamId) {
      return fetchDocument(teamId, documentId);
    }
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      teamId,
      createDocumentDto,
    }: {
      teamId: string;
      createDocumentDto: CreateDocumentDTO;
    }) => createDocument(teamId, createDocumentDto),
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

export const useSearchDocuments = (searchDocumentsDTO: SearchDocumentsDTO) =>
  useQuery(
    ['documents', { searchDocumentsDTO }],
    () => searchDocuments(searchDocumentsDTO),
    {
      initialData: [],
    },
  );
