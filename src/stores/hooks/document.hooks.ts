import {
  createDocument,
  deleteDocument,
  fetchDocument,
  fetchDocumentByTeam,
  searchDocuments,
  summarizeDocument,
  updateDocument,
  updateDocumentAsGuest,
} from '../api/document.api';
import {
  InfiniteData,
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
import { useParams, useSearchParams } from 'next/navigation';
import { SEARCH_QUERY_PARAM } from '../../constants/queryParams.constant';

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
  const { teamId, tagId } = useParams();
  const searchParams = useSearchParams();
  const search = searchParams.get(SEARCH_QUERY_PARAM);
  return useMutation({
    mutationFn: ({
      documentId,
      updateDocumentDto,
    }: {
      documentId: string;
      updateDocumentDto: UpdateDocumentDto;
    }) => updateDocument(documentId, updateDocumentDto),
    onSuccess: async (document) => {
      queryClient.setQueryData<InfiniteData<SearchDocumentsReturnType>>(
        [
          'documents',
          {
            query: {
              team: teamId,
              ...(tagId ? { tags: [tagId] } : {}),
              ...(search ? { text: search } : {}),
            },
          },
        ],
        (oldData) => {
          if (oldData) {
            const newData = oldData?.pages.map((page) => {
              return {
                ...page,
                documents: page.documents.map((doc) => {
                  if (doc._id === document._id) {
                    return document;
                  }
                  return doc;
                }),
              };
            });
            return {
              ...oldData,
              pages: newData,
            };
          }
        },
      );
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
