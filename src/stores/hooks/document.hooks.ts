'use client';

import {
  createDocument,
  deleteDocument,
  fetchDocument,
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
import { RouteParams } from '../types/global.types';
import { tagQueryKey } from './tag.hooks';
import { UNSORTED_TAGS_ID } from '../../constants/tag.constants';

const useSearchDocumentsQuery = () => {
  const { teamId, tagId } = useParams<RouteParams>();
  const searchParams = useSearchParams();
  const search = searchParams.get(SEARCH_QUERY_PARAM);
  return {
    team: teamId,
    ...(tagId ? { tags: [tagId] } : {}),
    ...(search ? { text: search } : {}),
  };
};
export const documentQueryKey = {
  base: ['document'],
  all: ['documents'],
  one: (documentId: string) => [...documentQueryKey.base, { documentId }],
  search: (searchDocumentsDTO: SearchDocumentsDTO) => [
    ...documentQueryKey.all,
    { query: searchDocumentsDTO },
  ],
};

export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: documentQueryKey.one(documentId),
    queryFn: () => fetchDocument(documentId),
  });
};

export const useSearchDocuments = (searchDocumentsDTO: SearchDocumentsDTO) =>
  useInfiniteQuery<SearchDocumentsReturnType>({
    queryKey: documentQueryKey.search(searchDocumentsDTO),
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
    onSuccess: async ({ team, tags }) => {
      await queryClient.invalidateQueries({
        queryKey: documentQueryKey.search({ team }),
      });
      await queryClient.setQueryData(
        tagQueryKey.documentsCountPerTag(team),
        (oldData?: Record<string, number>) => {
          const newData: Record<string, number> = oldData ? { ...oldData } : {};
          if (tags && tags.length > 0) {
            tags.forEach((tag) => {
              newData[tag] = (newData[tag] ?? 0) + 1;
            });
          } else {
            newData[UNSORTED_TAGS_ID] = (newData[UNSORTED_TAGS_ID] ?? 0) + 1;
          }
          return newData;
        },
      );
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
    onSuccess: async (document) => {
      await queryClient.invalidateQueries({
        queryKey: documentQueryKey.one(document._id),
      });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  const searchDocumentsQuery = useSearchDocumentsQuery();
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
        queryKey: documentQueryKey.one(document._id),
      });
      queryClient.setQueryData<InfiniteData<SearchDocumentsReturnType>>(
        documentQueryKey.search(searchDocumentsQuery),
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
    onSuccess: async (document) => {
      await queryClient.invalidateQueries({
        queryKey: documentQueryKey.one(document._id),
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
        queryKey: documentQueryKey.search({ team }),
      });
    },
  });
};
