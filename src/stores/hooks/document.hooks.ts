import { fetchDocuments } from '../api/document.api';
import { useQuery } from '@tanstack/react-query';

export const useRawDocuments = () => {
  return useQuery(['rawDocuments'], fetchDocuments, {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchInterval: 1000 * 60 * 2,
  });
};
