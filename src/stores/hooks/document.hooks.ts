import {
  createDocument,
  fetchDocument,
  updateDocumentAsGuest,
  fetchDocumentsByTeam,
  searchDocuments,
} from '../api/document.api';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  CreateDocumentDTO,
  SearchDocumentsDTO,
  SearchDocumentsReturnType,
  UpdateDocumentAsGuestDTO,
} from '../types/document.types';
import { useSelectedTeamId } from 'stores/data/team.data';
import { useSelectedTagId } from 'stores/data/tag.data';
import { useSearchDocumentsQuery } from 'stores/data/document.data';
import { useMemo } from 'react';

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

export const useUpdateDocumentAsGuest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      teamId,
      documentId,
      updateDocumentAsGuestDTO,
    }: {
      teamId: string;
      documentId: string;
      updateDocumentAsGuestDTO: UpdateDocumentAsGuestDTO;
    }) => updateDocumentAsGuest(teamId, documentId, updateDocumentAsGuestDTO),
    {
      onSuccess: (_, { documentId }) => {
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

export const useSearchDocuments = (searchDocumentsDTO: SearchDocumentsDTO) =>
  useInfiniteQuery<SearchDocumentsReturnType>(
    ['documents', { searchDocumentsDTO }],
    ({ pageParam = 0 }) =>
      searchDocuments({
        ...searchDocumentsDTO,
        page: pageParam,
      }),
    {
      initialData: {
        pages: [],
        pageParams: [],
      },
      getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    },
  );

export const useSearchedDocuments = () => {
  const [selectedTeamId] = useSelectedTeamId();
  const [selectedTagId] = useSelectedTagId();
  const [searchDocumentsQuery] = useSearchDocumentsQuery();
  const { data, ...other } = useSearchDocuments({
    ...(searchDocumentsQuery
      ? {
          text: searchDocumentsQuery,
        }
      : {}),
    tags: selectedTagId ? [selectedTagId] : undefined,
    team: selectedTeamId ? selectedTeamId : undefined,
  });

  const allDocuments = useMemo(
    () => data?.pages.flatMap((page) => page.documents) || [],
    [data?.pages],
  );

  const total = useMemo(
    () => data?.pages[0]?.total || 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.pages[0]?.total],
  );
  return {
    ...other,
    allDocuments,
    total,
  };
};
