import {
  createDocument,
  searchDocuments,
  searchDocumentsByUrl,
  searchDocumentsUrlsByUrls,
  summarizeText,
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
  UrlAndId,
} from '../types/document.types';
import { useMemo } from 'react';
import { useSearchDocumentsQuery } from '../data/document.data';
import { useSelectedTeamId } from '../data/team.data';
import {
  getClippedPage,
  getOnlyClippedContent,
} from '@src/helpers/clipper.helpers';

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      teamId,
      createDocumentDTO,
    }: {
      teamId: string;
      createDocumentDTO: CreateDocumentDTO;
    }) => createDocument(teamId, createDocumentDTO),
    {
      onSuccess: ({ team }) => {
        queryClient.invalidateQueries(['documents', { teamId: team }]);
      },
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
  useQuery(['documentsUrls', { urls }], () =>
    urls.length > 0 ? searchDocumentsUrlsByUrls(urls) : ([] as UrlAndId[]),
  );

export const useSearchDocumentsByUrl = (url: string) =>
  useQuery(['documentsByUrl', { url }], () => searchDocumentsByUrl(url), {
    initialData: [],
    enabled: !!url,
  });

export const useGetSummarizedText = (url: string, enabled: boolean) =>
  useQuery(
    ['summarizedText', { url }],
    async () => {
      const clippedPageContent = await getOnlyClippedContent();
      return (await summarizeText(clippedPageContent)).summary;
    },
    {
      enabled: !!url && enabled,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    },
  );
