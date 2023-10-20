import {
  createDocument,
  searchDocuments,
  searchDocumentsByUrl,
  searchDocumentsUrlsByUrls,
  summarizeText,
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
  UrlAndId,
} from '../../types/document.types';
import { useMemo } from 'react';
import { useSearchDocumentsQuery } from '@src/stores/hooks/jotai/document.hooks';
import { useSelectedTeamId } from '@src/stores/hooks/jotai/team.hooks';
import { getOnlyClippedContent } from '@src/helpers/clipper.helpers';

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      createDocumentDTO,
    }: {
      teamId: string;
      createDocumentDTO: CreateDocumentDTO;
    }) => createDocument(teamId, createDocumentDTO),
    onSuccess: async ({ team }) => {
      await queryClient.invalidateQueries({
        queryKey: ['documents', { teamId: team }],
      });
    },
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
    initialData: {
      pages: [],
      pageParams: [],
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });

export const useSearchedDocuments = () => {
  const [searchDocumentsQuery] = useSearchDocumentsQuery();
  const [selectedTeamId] = useSelectedTeamId();
  const { data, ...other } = useSearchDocuments({
    ...(searchDocumentsQuery && selectedTeamId
      ? {
          text: searchDocumentsQuery,
          team: selectedTeamId,
        }
      : {}),
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

export const useSearchDocumentsUrlsByUrls = (urls: string[]) =>
  useQuery({
    queryKey: ['documentsUrls', { urls }],
    queryFn: () =>
      urls.length > 0 ? searchDocumentsUrlsByUrls(urls) : ([] as UrlAndId[]),
  });

export const useSearchDocumentsByUrl = (url: string) =>
  useQuery({
    queryKey: ['documentsByUrl', { url }],
    queryFn: () => searchDocumentsByUrl(url),
    initialData: [],
    enabled: !!url,
  });

export const useGetSummarizedText = (url: string, enabled: boolean) =>
  useQuery({
    queryKey: ['summarizedText', { url }],
    queryFn: async () => {
      const clippedPageContent = await getOnlyClippedContent();
      return (await summarizeText(clippedPageContent)).summary;
    },
    enabled: !!url && enabled,
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });
