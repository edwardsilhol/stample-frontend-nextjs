import {
  getCurrentlyDisplayedDOMUrl,
  isDocumentClippable,
} from '@src/helpers/clipper.helpers';
import { useQuery } from '@tanstack/react-query';

export const useCurrentPageUrl = () =>
  useQuery({
    queryKey: ['current-page-url'],
    queryFn: getCurrentlyDisplayedDOMUrl,
  });

export const useIsDocumentClippable = () =>
  useQuery({
    queryKey: ['is-document-clippable'],
    queryFn: isDocumentClippable,
  });
