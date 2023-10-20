import {
  createDocument,
  fetchDocument,
  updateDocumentAsGuest,
  fetchDocumentsByTeam,
  searchDocuments,
  fetchDocumentByTeam,
  summarizeDocument,
} from '../../api/document.api';
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
} from '../../types/document.types';
import { useSelectedTeamId } from 'stores/hooks/jotai/team.hooks';
import { useSelectedTagId } from 'stores/hooks/jotai/tag.hooks';
import { useSearchDocumentsQuery } from 'stores/hooks/jotai/document.hooks';
import { useMemo } from 'react';

export const useDocument = (teamId: string | null, documentId: string) => {
  return useQuery({
    queryKey: ['document', { documentId }],
    queryFn: () => {
      if (teamId) {
        return fetchDocumentByTeam(teamId, documentId);
      } else {
        return fetchDocument(documentId);
      }
    },
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      createDocumentDto,
    }: {
      teamId: string;
      createDocumentDto: CreateDocumentDTO;
    }) => createDocument(teamId, createDocumentDto),
    onSuccess: async ({ team }) => {
      await queryClient.invalidateQueries({
        queryKey: ['documents', { teamId: team }],
      });
    },
  });
};

export const useUpdateDocumentAsGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      documentId,
      updateDocumentAsGuestDTO,
    }: {
      teamId: string;
      documentId: string;
      updateDocumentAsGuestDTO: UpdateDocumentAsGuestDTO;
    }) => updateDocumentAsGuest(teamId, documentId, updateDocumentAsGuestDTO),
    onSuccess: async (_, { documentId }) => {
      await queryClient.invalidateQueries({
        queryKey: ['document', { documentId }],
      });
    },
  });
};

export const useDocumentsByTeam = (teamId: string | null) => {
  return useQuery({
    queryKey: ['documents', { teamId }],
    queryFn: () => {
      if (teamId) {
        return fetchDocumentsByTeam(teamId);
      }
      return [];
    },
    initialData: [],
  });
};

export const useSearchDocuments = (searchDocumentsDTO: SearchDocumentsDTO) =>
  useInfiniteQuery<SearchDocumentsReturnType>({
    queryKey: ['documents', { searchDocumentsDTO }],
    queryFn: ({ pageParam }) =>
      searchDocuments({
        ...searchDocumentsDTO,
        page: pageParam as number,
      }),
    initialPageParam: 0,
    initialData: {
      pages: [],
      pageParams: [],
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

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

export const useSummarizeDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId }: { documentId: string }) =>
      summarizeDocument(documentId),
    onSuccess: async (_, { documentId }) => {
      await queryClient.invalidateQueries({
        queryKey: ['document', { documentId }],
      });
    },
  });
};
