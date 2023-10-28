import {
  createDocument,
  fetchDocument,
  updateDocumentAsGuest,
  searchDocuments,
  fetchDocumentByTeam,
  summarizeDocument,
  deleteDocument,
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
export const useSearchDocuments = (searchDocumentsDTO: SearchDocumentsDTO) =>
  useInfiniteQuery<SearchDocumentsReturnType>({
    queryKey: ['documents', { query: searchDocumentsDTO }],
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
        queryKey: ['documents', { team }],
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

export const useDeleteDocument = (team: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['documents', { query: { team } }],
      });
    },
  });
};
