import {
  createDocument,
  fetchDocument,
  updateDocumentAsGuest,
  searchDocuments,
  fetchDocumentByTeam,
  summarizeDocument,
  deleteDocument,
  updateDocument,
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
  UpdateDocumentDto,
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
      documentId,
      updateDocumentAsGuestDto,
    }: {
      documentId: string;
      updateDocumentAsGuestDto: UpdateDocumentAsGuestDTO;
    }) => updateDocumentAsGuest(documentId, updateDocumentAsGuestDto),
    onSuccess: async (_, { documentId }) => {
      await queryClient.invalidateQueries({
        queryKey: ['document', { documentId }],
      });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      documentId,
      updateDocumentDto,
    }: {
      documentId: string;
      updateDocumentDto: UpdateDocumentDto;
    }) => updateDocument(documentId, updateDocumentDto),
    onSuccess: async (document) => {
      await queryClient.invalidateQueries({
        queryKey: ['document', { documentId: document._id }],
      });
      await queryClient.invalidateQueries({
        queryKey: ['documents', { query: { team: document.team } }],
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

export const useAddDocumentToNewsletter = () => {
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
